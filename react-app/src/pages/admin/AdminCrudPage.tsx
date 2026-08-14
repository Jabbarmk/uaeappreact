import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

// ── Types ─────────────────────────────────────────────────────────────────────

type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'toggle' | 'date' | 'image' | 'video' | 'media' | 'map-link' | 'clients' | 'gallery' | 'cover' | 'services' | 'products' | 'business-search' | 'main-category-select' | 'category-search' | 'time-picker' | 'user-search' | 'event-category-select' | 'resource-select' | 'university-select';

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  folder?: string;
  required?: boolean;
  placeholder?: string;
  syncTo?: string;
  syncTransform?: 'strip-plus';
  syncNameTo?: string;
  defaultOn?: boolean;                            // for 'toggle': new records start ON
  syncIconTo?: string;
  optionsResource?: string;                       // for 'resource-select': the admin CRUD resource to load options from
}

interface FilterConfig {
  key: string;                                    // query param + column to filter on
  label: string;
  optionsFrom: string;                            // admin resource for options, or 'emirates'
}

interface ResourceConfig {
  resource: string;
  label: string;
  displayCol: string;
  listCols?: string[];
  fields: FieldConfig[];
  searchable?: boolean;
  filters?: FilterConfig[];
}

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'];

// ── Resource configs ──────────────────────────────────────────────────────────

const RESOURCE_CONFIGS: Record<string, ResourceConfig> = {
  sliders: { resource: 'sliders', label: 'Sliders', displayCol: 'title', fields: [
    { key: 'title',       label: 'Title',                          type: 'text' },
    { key: 'subtitle',    label: 'Subtitle',                       type: 'text' },
    { key: 'button_text', label: 'Button Text',                    type: 'text' },
    { key: 'button_link', label: 'Button Link (overrides business)', type: 'text' },
    { key: 'business_id', label: 'Link to Business (optional)',    type: 'business-search' },
    { key: 'image',       label: 'Image',                          type: 'image', folder: 'slides' },
    { key: 'sort_order',  label: 'Sort Order',                     type: 'number' },
    { key: 'is_active',   label: 'Active',                         type: 'toggle' },
  ]},
  'main-categories': { resource: 'main-categories', label: 'Main Categories', displayCol: 'name', listCols: ['icon', 'name', 'link', 'sort_order'], searchable: true, fields: [
    { key: 'name',       label: 'Name',       type: 'text', required: true },
    { key: 'icon',       label: 'Icon',       type: 'text' },
    { key: 'link',       label: 'Link',       type: 'text' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_active',  label: 'Active',     type: 'toggle' },
  ]},
  'home-categories': { resource: 'home-categories', label: 'Home Categories', displayCol: 'name', listCols: ['icon', 'name', 'sort_order'], fields: [
    { key: 'category_id', label: 'Business Category', type: 'category-search', syncNameTo: 'name', syncIconTo: 'icon' },
    { key: 'name',        label: 'Name',              type: 'text', required: true },
    { key: 'icon',        label: 'Icon (emoji)',       type: 'text' },
    { key: 'sort_order',  label: 'Sort Order',        type: 'number' },
    { key: 'is_active',   label: 'Active',            type: 'toggle' },
  ]},
  'popular-categories': { resource: 'popular-categories', label: 'Popular Categories', displayCol: 'name', listCols: ['image', 'name', 'link', 'sort_order'], fields: [
    { key: 'category_id', label: 'Business Category', type: 'category-search', syncNameTo: 'name' },
    { key: 'name',        label: 'Name',              type: 'text', required: true },
    { key: 'image',       label: 'Image',             type: 'image', folder: 'categories' },
    { key: 'link',        label: 'Link',              type: 'text' },
    { key: 'sort_order',  label: 'Sort Order',        type: 'number' },
    { key: 'is_active',   label: 'Active',            type: 'toggle' },
  ]},
  'business-categories': { resource: 'business-categories', label: 'Business Categories', displayCol: 'name', listCols: ['icon', 'name', 'group_name', 'sort_order'], searchable: true, filters: [{ key: 'main_category_id', label: 'Main Category', optionsFrom: 'main-categories' }], fields: [
    { key: 'name',       label: 'Name',       type: 'text', required: true },
    { key: 'icon',       label: 'Icon',       type: 'text' },
    { key: 'group_name', label: 'Group Name', type: 'main-category-select' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_active',  label: 'Active',     type: 'toggle' },
  ]},
  'category-banners': { resource: 'category-banners', label: 'Category Banners', displayCol: 'title', listCols: ['image', 'category_name', 'title', 'sort_order'], filters: [{ key: 'category_id', label: 'Category', optionsFrom: 'business-categories' }], fields: [
    { key: 'category_id', label: 'Business Category (banner shows on this category\'s listing page)', type: 'category-search' },
    { key: 'image',       label: 'Banner Image (width fills the page; height is auto — use any size)', type: 'image', folder: 'banners' },
    { key: 'video',       label: 'Banner Video (optional — plays instead of the image)', type: 'video', folder: 'banners' },
    { key: 'business_id', label: 'Link to Business (optional — tapping the banner opens this business)', type: 'business-search' },
    { key: 'title',       label: 'Overlay Title (optional)',    type: 'text' },
    { key: 'subtitle',    label: 'Overlay Subtitle (optional)', type: 'text' },
    { key: 'link',        label: 'Tap Link (optional — used only if no business is linked)', type: 'text', placeholder: '/offers or https://' },
    { key: 'sort_order',  label: 'Sort Order',                  type: 'number' },
    { key: 'is_active',   label: 'Active',                      type: 'toggle' },
  ]},
  businesses: { resource: 'businesses', label: 'Businesses', displayCol: 'name', listCols: ['image', 'name', 'category_name', 'emirate', 'phone', 'rating', 'sort_order'], searchable: true, filters: [{ key: 'category_id', label: 'Category', optionsFrom: 'business-categories' }, { key: 'emirate', label: 'Emirate', optionsFrom: 'emirates' }], fields: [
    { key: 'user_id',          label: 'Assigned User',    type: 'user-search' },
    { key: 'name',             label: 'Name',             type: 'text',            required: true },
    { key: 'category_id',      label: 'Category',         type: 'category-search' },
    { key: 'tagline',          label: 'Tagline',          type: 'text' },
    { key: 'description',      label: 'Description',      type: 'textarea' },
    { key: 'about',            label: 'About',            type: 'textarea' },
    { key: 'image',            label: 'Cover Image / Video (fallback)', type: 'media', folder: 'businesses' },
    { key: 'logo',             label: 'Logo',             type: 'image',           folder: 'businesses' },
    { key: 'cover',            label: 'Cover Slider (multiple images + video — shown at top of the detail page)', type: 'cover' },
    { key: 'gallery',          label: 'Gallery Images (multiple — shown in the business photo gallery)', type: 'gallery' },
    { key: 'services',         label: 'Services Sections (named sections with items — e.g. "Services & Solutions")', type: 'services' },
    { key: 'store_url',        label: 'Online Store URL (Buy Online link)', type: 'text', placeholder: 'https://' },
    { key: 'products',         label: 'Products (storefront — image, name, price, category)', type: 'products' },
    { key: 'clients',          label: 'Clients & Partners (logos shown on the detail page)', type: 'clients' },
    { key: 'emirate',          label: 'Emirate',          type: 'select',          options: EMIRATES },
    { key: 'address',          label: 'Address',          type: 'text' },
    { key: 'map_embed',        label: 'Location Map Link (paste a Google Maps embed or share link — Latitude & Longitude below fill in automatically)', type: 'map-link', placeholder: 'https://www.google.com/maps/embed?pb=… or …/@25.2048,55.2708,17z' },
    { key: 'latitude',         label: 'Latitude (for Near Me distance)',  type: 'number', placeholder: '25.2048493' },
    { key: 'longitude',        label: 'Longitude (for Near Me distance)', type: 'number', placeholder: '55.2707828' },
    { key: 'phone',            label: 'Phone',            type: 'text',            placeholder: '+971559164496', syncTo: 'whatsapp', syncTransform: 'strip-plus' },
    { key: 'whatsapp',         label: 'WhatsApp',         type: 'text',            placeholder: '971559164496' },
    { key: 'email',            label: 'Email',            type: 'text' },
    { key: 'website',          label: 'Website',          type: 'text' },
    { key: 'opening_time',     label: 'Opening Time',     type: 'time-picker' },
    { key: 'closing_time',     label: 'Closing Time',     type: 'time-picker' },
    { key: 'rating',           label: 'Rating (0–5)',     type: 'number' },
    { key: 'featured',         label: 'Featured (big card on listing; off = compact row)', type: 'toggle' },
    { key: 'sort_order',       label: 'Sort Order',       type: 'number' },
    { key: 'established_year', label: 'Est. Year',        type: 'number' },
    { key: 'employees',        label: 'Team Size (shown in the stats row, e.g. 50+)', type: 'text', placeholder: '50+' },
    { key: 'show_stats',       label: 'Show Stats Row (Rating / Est. Year / Team Size / Reviews on the detail page)', type: 'toggle', defaultOn: true },
    { key: 'show_clients',     label: 'Show Clients & Partners section on the detail page', type: 'toggle', defaultOn: true },
    { key: 'is_online_store',  label: 'Online Store (show product prices + Buy Online)', type: 'toggle' },
    { key: 'is_active',        label: 'Active',           type: 'toggle' },
  ]},
  offers: { resource: 'offers', label: 'Offers', displayCol: 'title', listCols: ['image', 'title', 'price', 'emirate', 'valid_to'], fields: [
    { key: 'business_id',      label: 'Business ID',      type: 'number', required: true },
    { key: 'title',            label: 'Title',            type: 'text',   required: true },
    { key: 'description',      label: 'Description',      type: 'textarea' },
    { key: 'details',          label: 'Details',          type: 'textarea' },
    { key: 'image',            label: 'Cover Image (fallback / thumbnail)', type: 'image', folder: 'offers' },
    { key: 'gallery',          label: 'Gallery Images (multiple — shown on the offer detail page)', type: 'gallery' },
    { key: 'price',            label: 'Price',            type: 'number' },
    { key: 'original_price',   label: 'Original Price',   type: 'number' },
    { key: 'currency',         label: 'Currency',         type: 'text' },
    { key: 'discount_percent', label: 'Discount %',       type: 'number' },
    { key: 'emirate',          label: 'Emirate',          type: 'select', options: EMIRATES },
    { key: 'valid_from',       label: 'Valid From',       type: 'date' },
    { key: 'valid_to',         label: 'Valid To',         type: 'date' },
    { key: 'is_active',        label: 'Active',           type: 'toggle' },
  ]},
  'classified-categories': { resource: 'classified-categories', label: 'Classified Categories', displayCol: 'name', fields: [
    { key: 'name',       label: 'Name',       type: 'text', required: true },
    { key: 'icon',       label: 'Icon',       type: 'text' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_active',  label: 'Active',     type: 'toggle' },
  ]},
  'classified-sections': { resource: 'classified-sections', label: 'Classified Sections', displayCol: 'name', fields: [
    { key: 'name',       label: 'Name',       type: 'text', required: true },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_active',  label: 'Active',     type: 'toggle' },
  ]},
  classifieds: { resource: 'classifieds', label: 'Classifieds', displayCol: 'title', fields: [
    { key: 'user_id',          label: 'Assigned User', type: 'user-search' },
    { key: 'title',            label: 'Title',       type: 'text', required: true },
    { key: 'description',      label: 'Description', type: 'textarea' },
    { key: 'price',            label: 'Price',       type: 'number' },
    { key: 'currency',         label: 'Currency',    type: 'text' },
    { key: 'category_id',      label: 'Category ID', type: 'number' },
    { key: 'section_id',       label: 'Section ID',  type: 'number' },
    { key: 'image',            label: 'Image',       type: 'image', folder: 'classifieds' },
    { key: 'location',         label: 'Location',    type: 'text' },
    { key: 'brand',            label: 'Brand',       type: 'text' },
    { key: 'model',            label: 'Model',       type: 'text' },
    { key: 'color',            label: 'Color',       type: 'text' },
    { key: 'condition_status', label: 'Condition',   type: 'text' },
    { key: 'is_active',        label: 'Active',      type: 'toggle' },
  ]},
  'property-categories': { resource: 'property-categories', label: 'Property Categories', displayCol: 'name', listCols: ['icon', 'name', 'sort_order'], fields: [
    { key: 'name',       label: 'Name',       type: 'text', required: true },
    { key: 'icon',       label: 'Icon (emoji)', type: 'text' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_active',  label: 'Active',     type: 'toggle' },
  ]},
  'real-estate-companies': { resource: 'real-estate-companies', label: 'Real Estate Companies', displayCol: 'name', listCols: ['logo', 'name', 'emirate', 'is_featured'], fields: [
    { key: 'user_id',     label: 'Assigned User',  type: 'user-search' },
    { key: 'name',        label: 'Name',           type: 'text', required: true },
    { key: 'logo',        label: 'Logo',           type: 'image', folder: 'realestate' },
    { key: 'banner',      label: 'Banner',         type: 'image', folder: 'realestate' },
    { key: 'about',       label: 'About',          type: 'textarea' },
    { key: 'phone',       label: 'Phone',          type: 'text', placeholder: '+9714...', syncTo: 'whatsapp', syncTransform: 'strip-plus' },
    { key: 'whatsapp',    label: 'WhatsApp',       type: 'text' },
    { key: 'email',       label: 'Email',          type: 'text' },
    { key: 'website',     label: 'Website',        type: 'text' },
    { key: 'emirate',     label: 'Emirate',        type: 'select', options: EMIRATES },
    { key: 'address',     label: 'Address',        type: 'text' },
    { key: 'sort_order',  label: 'Sort Order',     type: 'number' },
    { key: 'status',      label: 'Status',         type: 'select', options: ['pending', 'approved', 'rejected'] },
    { key: 'is_featured', label: 'Featured (major player)', type: 'toggle' },
    { key: 'is_active',   label: 'Active',         type: 'toggle' },
  ]},
  properties: { resource: 'properties', label: 'Properties', displayCol: 'title', listCols: ['image', 'title', 'purpose', 'price', 'emirate'], fields: [
    { key: 'user_id',     label: 'Assigned User',  type: 'user-search' },
    { key: 'company_id',  label: 'Company ID',     type: 'number' },
    { key: 'category_id', label: 'Category ID',    type: 'number' },
    { key: 'title',       label: 'Title',          type: 'text', required: true },
    { key: 'description', label: 'Description',     type: 'textarea' },
    { key: 'purpose',     label: 'Purpose',        type: 'select', options: ['Rent', 'Sale'] },
    { key: 'price',       label: 'Price',          type: 'number' },
    { key: 'currency',    label: 'Currency',       type: 'text' },
    { key: 'rent_period', label: 'Rent Period',    type: 'select', options: ['Monthly', 'Yearly'] },
    { key: 'bedrooms',    label: 'Bedrooms',       type: 'text' },
    { key: 'bathrooms',   label: 'Bathrooms',      type: 'text' },
    { key: 'area_sqft',   label: 'Area (sqft)',    type: 'text' },
    { key: 'furnished',   label: 'Furnishing',     type: 'select', options: ['Furnished', 'Unfurnished', 'Partly Furnished'] },
    { key: 'parking',     label: 'Parking',        type: 'text' },
    { key: 'amenities',   label: 'Amenities (comma-sep)', type: 'textarea' },
    { key: 'location',    label: 'Location',       type: 'text' },
    { key: 'emirate',     label: 'Emirate',        type: 'select', options: EMIRATES },
    { key: 'image',       label: 'Cover Image',    type: 'image', folder: 'realestate' },
    { key: 'status',      label: 'Status',         type: 'select', options: ['pending', 'approved', 'rejected'] },
    { key: 'is_active',   label: 'Active',         type: 'toggle' },
  ]},
  'real-estate-projects': { resource: 'real-estate-projects', label: 'Off-Plan Projects', displayCol: 'name', listCols: ['image', 'name', 'developer', 'emirate'], fields: [
    { key: 'user_id',       label: 'Assigned User',  type: 'user-search' },
    { key: 'company_id',    label: 'Company ID',     type: 'number' },
    { key: 'name',          label: 'Name',           type: 'text', required: true },
    { key: 'developer',     label: 'Developer',      type: 'text' },
    { key: 'location',      label: 'Location',       type: 'text' },
    { key: 'emirate',       label: 'Emirate',        type: 'select', options: EMIRATES },
    { key: 'description',   label: 'Description',     type: 'textarea' },
    { key: 'starting_price', label: 'Starting Price', type: 'number' },
    { key: 'currency',      label: 'Currency',       type: 'text' },
    { key: 'handover',      label: 'Handover',       type: 'text', placeholder: 'Q4 2026' },
    { key: 'payment_plan',  label: 'Payment Plan',   type: 'text' },
    { key: 'image',         label: 'Cover Image',    type: 'image', folder: 'realestate' },
    { key: 'status',        label: 'Status',         type: 'select', options: ['pending', 'approved', 'rejected'] },
    { key: 'is_featured',   label: 'Featured',       type: 'toggle' },
    { key: 'is_active',     label: 'Active',         type: 'toggle' },
  ]},
  'event-categories': { resource: 'event-categories', label: 'Event Categories', displayCol: 'name', listCols: ['icon', 'name', 'sort_order'], fields: [
    { key: 'name',       label: 'Name',         type: 'text', required: true },
    { key: 'icon',       label: 'Icon (emoji)', type: 'text' },
    { key: 'sort_order', label: 'Sort Order',   type: 'number' },
    { key: 'is_active',  label: 'Active',       type: 'toggle' },
  ]},
  events: { resource: 'events', label: 'Events', displayCol: 'title', listCols: ['poster', 'title', 'event_date', 'emirate'], fields: [
    { key: 'user_id',            label: 'Assigned User',   type: 'user-search' },
    { key: 'category_id',        label: 'Category',        type: 'event-category-select' },
    { key: 'title',              label: 'Event Title',     type: 'text', required: true },
    { key: 'description',        label: 'Description',     type: 'textarea' },
    { key: 'poster',             label: 'Event Poster (cover / thumbnail)', type: 'image', folder: 'events' },
    { key: 'gallery',            label: 'Gallery Images (multiple — shown on the event detail page)', type: 'gallery' },
    { key: 'location',           label: 'Location',        type: 'text', placeholder: 'Downtown Dubai' },
    { key: 'venue',              label: 'Venue',           type: 'text', placeholder: 'Dubai World Trade Centre' },
    { key: 'emirate',            label: 'Emirate',         type: 'select', options: EMIRATES },
    { key: 'event_date',         label: 'Start Date',      type: 'date' },
    { key: 'end_date',           label: 'End Date',        type: 'date' },
    { key: 'start_time',         label: 'Start Time',      type: 'time-picker' },
    { key: 'end_time',           label: 'End Time',        type: 'time-picker' },
    { key: 'price',              label: 'Ticket Price (0 = Free)', type: 'number' },
    { key: 'currency',           label: 'Currency',        type: 'text' },
    { key: 'booking_url',        label: 'Booking Link',    type: 'text', placeholder: 'https://' },
    { key: 'organizer',          label: 'Organizer',       type: 'text' },
    { key: 'organizer_phone',    label: 'Organizer Phone', type: 'text', placeholder: '+9714...', syncTo: 'organizer_whatsapp', syncTransform: 'strip-plus' },
    { key: 'organizer_whatsapp', label: 'Organizer WhatsApp', type: 'text' },
    { key: 'organizer_email',    label: 'Organizer Email', type: 'text' },
    { key: 'status',             label: 'Status',          type: 'select', options: ['pending', 'approved', 'rejected'] },
    { key: 'is_featured',        label: 'Featured',        type: 'toggle' },
    { key: 'is_active',          label: 'Active',          type: 'toggle' },
  ]},
  'institution-types': { resource: 'institution-types', label: 'Institution Types', displayCol: 'name', listCols: ['icon', 'name', 'sort_order'], searchable: true, fields: [
    { key: 'name',       label: 'Name',         type: 'text', required: true },
    { key: 'icon',       label: 'Icon (emoji)', type: 'text' },
    { key: 'sort_order', label: 'Sort Order',   type: 'number' },
    { key: 'is_active',  label: 'Active',       type: 'toggle' },
  ]},
  'course-categories': { resource: 'course-categories', label: 'Course Categories', displayCol: 'name', listCols: ['icon', 'name', 'sort_order'], searchable: true, fields: [
    { key: 'name',       label: 'Name',         type: 'text', required: true },
    { key: 'icon',       label: 'Icon (emoji)', type: 'text' },
    { key: 'sort_order', label: 'Sort Order',   type: 'number' },
    { key: 'is_active',  label: 'Active',       type: 'toggle' },
  ]},
  'study-levels': { resource: 'study-levels', label: 'Study Levels', displayCol: 'name', listCols: ['icon', 'name', 'sort_order'], searchable: true, fields: [
    { key: 'name',       label: 'Name',         type: 'text', required: true },
    { key: 'icon',       label: 'Icon (emoji)', type: 'text' },
    { key: 'sort_order', label: 'Sort Order',   type: 'number' },
    { key: 'is_active',  label: 'Active',       type: 'toggle' },
  ]},
  courses: { resource: 'courses', label: 'Courses', displayCol: 'name', listCols: ['image', 'name', 'duration'], searchable: true,
    filters: [{ key: 'study_level_id', label: 'Study Level', optionsFrom: 'study-levels' }, { key: 'course_category_id', label: 'Course Category', optionsFrom: 'course-categories' }],
    fields: [
    { key: 'course_category_id',   label: 'Course Category',       type: 'resource-select', optionsResource: 'course-categories' },
    { key: 'study_level_id',       label: 'Study Level',           type: 'resource-select', optionsResource: 'study-levels' },
    { key: 'name',                 label: 'Course Name',           type: 'text', required: true },
    { key: 'image',                label: 'Course Image',          type: 'image', folder: 'courses' },
    { key: 'specialisation',       label: 'Specialisation',        type: 'text' },
    { key: 'duration',             label: 'Duration',              type: 'text', placeholder: '3–4 years' },
    { key: 'description',          label: 'Description',           type: 'textarea' },
    { key: 'is_active',            label: 'Active',                type: 'toggle' },
  ]},
  jobs: { resource: 'jobs', label: 'Jobs', displayCol: 'title', fields: [
    { key: 'user_id',      label: 'Assigned User', type: 'user-search' },
    { key: 'title',        label: 'Title',        type: 'text', required: true },
    { key: 'company',      label: 'Company',      type: 'text' },
    { key: 'location',     label: 'Location',     type: 'text' },
    { key: 'job_type',     label: 'Job Type',     type: 'select', options: ['Fulltime', 'Part Time', 'Contract', 'Freelance'] },
    { key: 'salary_min',   label: 'Salary Min',   type: 'number' },
    { key: 'salary_max',   label: 'Salary Max',   type: 'number' },
    { key: 'currency',     label: 'Currency',     type: 'text' },
    { key: 'description',  label: 'Description',  type: 'textarea' },
    { key: 'requirements', label: 'Requirements', type: 'textarea' },
    { key: 'benefits',     label: 'Benefits',     type: 'textarea' },
    { key: 'is_featured',  label: 'Featured',     type: 'toggle' },
    { key: 'is_active',    label: 'Active',       type: 'toggle' },
  ]},
  profiles: { resource: 'profiles', label: 'Profiles', displayCol: 'full_name', fields: [
    { key: 'user_id',           label: 'Assigned User',    type: 'user-search' },
    { key: 'full_name',         label: 'Full Name',        type: 'text', required: true },
    { key: 'title',             label: 'Job Title',        type: 'text' },
    { key: 'photo',             label: 'Photo',            type: 'image', folder: 'profiles' },
    { key: 'email',             label: 'Email',            type: 'text' },
    { key: 'phone',             label: 'Phone',            type: 'text' },
    { key: 'whatsapp',          label: 'WhatsApp',         type: 'text' },
    { key: 'linkedin',          label: 'LinkedIn URL',     type: 'text' },
    { key: 'location',          label: 'Location',         type: 'text' },
    { key: 'current_company',   label: 'Current Company',  type: 'text' },
    { key: 'experience_years',  label: 'Experience Years', type: 'number' },
    { key: 'technical_skills',  label: 'Skills (comma-sep)', type: 'text' },
    { key: 'education_details', label: 'Education (Degree@Uni|Years per line)', type: 'textarea' },
    { key: 'certifications',    label: 'Certifications (one per line)', type: 'textarea' },
    { key: 'projects',          label: 'Projects (one per line)', type: 'textarea' },
    { key: 'languages',         label: 'Languages (comma-sep)', type: 'text' },
    { key: 'is_active',         label: 'Active', type: 'toggle' },
  ]},
  'work-experience': { resource: 'work-experience', label: 'Work Experience', displayCol: 'job_title', listCols: ['job_title', 'company', 'start_year', 'is_current'], fields: [
    { key: 'user_id',     label: 'Assigned User',          type: 'user-search' },
    { key: 'job_title',   label: 'Job Title',              type: 'text', required: true },
    { key: 'company',     label: 'Company',                type: 'text', required: true },
    { key: 'location',    label: 'Location',               type: 'text' },
    { key: 'start_month', label: 'Start Month (1–12)',     type: 'select', options: ['1','2','3','4','5','6','7','8','9','10','11','12'] },
    { key: 'start_year',  label: 'Start Year',             type: 'number' },
    { key: 'end_month',   label: 'End Month (1–12)',       type: 'select', options: ['1','2','3','4','5','6','7','8','9','10','11','12'] },
    { key: 'end_year',    label: 'End Year',               type: 'number' },
    { key: 'is_current',  label: 'Currently Working Here', type: 'toggle' },
    { key: 'description', label: 'Description',            type: 'textarea' },
  ]},
  pages: { resource: 'pages', label: 'Pages', displayCol: 'title', fields: [
    { key: 'slug',             label: 'Slug (URL)',        type: 'text', required: true },
    { key: 'title',            label: 'Title',             type: 'text', required: true },
    { key: 'content',          label: 'Content (HTML)',    type: 'textarea' },
    { key: 'meta_description', label: 'Meta Description',  type: 'textarea' },
    { key: 'is_active',        label: 'Active',            type: 'toggle' },
  ]},
};

// ── Design tokens ─────────────────────────────────────────────────────────────

const ACCENT = '#0067C0';
const FONT = "'Segoe UI', 'Inter', system-ui, sans-serif";

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '6px 10px',
  border: '1px solid #C8C8C8', borderRadius: 3,
  fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box',
  background: '#fff', color: '#1a1a1a', outline: 'none',
};

// ── ImageUploader ─────────────────────────────────────────────────────────────

function ImageUploader({ folder, currentValue, onChange }: { folder: string; currentValue: string; onChange: (f: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post(`/admin/upload/${folder}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.filename as string);
    } catch { setErr('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      {currentValue && (
        <img src={currentValue.startsWith('http') ? currentValue : `/assets/uploads/${folder}/${currentValue}`} alt="preview"
          style={{ width: 80, height: 60, objectFit: 'cover', border: '1px solid #E0E0E0', borderRadius: 3, display: 'block', marginBottom: 6 }} />
      )}
      <input type="file" accept="image/*" onChange={handleFile} style={{ fontSize: 12 }} />
      {uploading && <div style={{ fontSize: 11, color: '#616161', marginTop: 3 }}>Uploading…</div>}
      {err && <div style={{ fontSize: 11, color: '#C42B1C', marginTop: 3 }}>{err}</div>}
      {currentValue && <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>{currentValue}</div>}
    </div>
  );
}

const isVideoFile = (v: string) => /\.(mp4|webm|mov|m4v|ogv|ogg)(\?|$)/i.test(v);

// Extract coordinates from a Google Maps embed/share link (or plain "lat, lng").
function parseLatLng(input: string): { lat: number; lng: number } | null {
  if (!input) return null;
  const pb = input.match(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/);          // embed pb: !2d<lng>!3d<lat>
  if (pb) return { lat: Number(pb[2]), lng: Number(pb[1]) };
  const at = input.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);              // share: @lat,lng
  if (at) return { lat: Number(at[1]), lng: Number(at[2]) };
  const q = input.match(/[?&](?:q|ll|query)=(-?\d+(?:\.\d+)?)(?:%2C|,)\s*(-?\d+(?:\.\d+)?)/i)
    || input.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);       // ?q=lat,lng or bare "lat, lng"
  if (q) return { lat: Number(q[1]), lng: Number(q[2]) };
  return null;
}

// ── MediaUploader (single image OR video; remove option) ────────────────────────

function MediaUploader({ folder, currentValue, onChange }: { folder: string; currentValue: string; onChange: (f: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post(`/admin/upload-video/${folder}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.filename as string);
    } catch { setErr('Upload failed (max 60MB, image or video)'); }
    finally { setUploading(false); }
  };

  const src = currentValue ? (currentValue.startsWith('http') ? currentValue : `/assets/uploads/${folder}/${currentValue}`) : '';

  return (
    <div>
      {currentValue && (
        isVideoFile(currentValue)
          ? <video src={src} muted controls preload="metadata"
              style={{ width: 160, height: 90, objectFit: 'cover', border: '1px solid #E0E0E0', borderRadius: 3, display: 'block', marginBottom: 6, background: '#000' }} />
          : <img src={src} alt="preview"
              style={{ width: 80, height: 60, objectFit: 'cover', border: '1px solid #E0E0E0', borderRadius: 3, display: 'block', marginBottom: 6 }} />
      )}
      <input type="file" accept="image/*,video/*" onChange={handleFile} style={{ fontSize: 12 }} />
      {uploading && <div style={{ fontSize: 11, color: '#616161', marginTop: 3 }}>Uploading…</div>}
      {err && <div style={{ fontSize: 11, color: '#C42B1C', marginTop: 3 }}>{err}</div>}
      {currentValue && (
        <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
          {currentValue}
          <button type="button" onClick={() => onChange('')} style={{ marginLeft: 8, border: 'none', background: 'none', color: '#C42B1C', cursor: 'pointer', fontSize: 10 }}>✕ Remove</button>
        </div>
      )}
    </div>
  );
}

// ── VideoUploader (single video file; uses the larger upload-video endpoint) ────

function VideoUploader({ folder, currentValue, onChange }: { folder: string; currentValue: string; onChange: (f: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post(`/admin/upload-video/${folder}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.filename as string);
    } catch { setErr('Upload failed (max 60MB, video files only)'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      {currentValue && (
        <video src={currentValue.startsWith('http') ? currentValue : `/assets/uploads/${folder}/${currentValue}`}
          muted controls preload="metadata"
          style={{ width: 160, height: 90, objectFit: 'cover', border: '1px solid #E0E0E0', borderRadius: 3, display: 'block', marginBottom: 6, background: '#000' }} />
      )}
      <input type="file" accept="video/*" onChange={handleFile} style={{ fontSize: 12 }} />
      {uploading && <div style={{ fontSize: 11, color: '#616161', marginTop: 3 }}>Uploading…</div>}
      {err && <div style={{ fontSize: 11, color: '#C42B1C', marginTop: 3 }}>{err}</div>}
      {currentValue && (
        <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
          {currentValue}
          <button type="button" onClick={() => onChange('')} style={{ marginLeft: 8, border: 'none', background: 'none', color: '#C42B1C', cursor: 'pointer', fontSize: 10 }}>✕ Remove</button>
        </div>
      )}
    </div>
  );
}

// ── ClientsManager (Clients & Partners: name, logo, website, ordering) ──────────

function ClientsManager({ recordId }: { recordId: number | null }) {
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null); // null = closed, {} = new, row = edit

  const load = useCallback(() => {
    if (recordId == null) return;
    api.get(`/admin/businesses/${recordId}/clients`).then((r) => setRows(r.data.clients || [])).catch(() => {});
  }, [recordId]);
  useEffect(load, [load]);

  if (recordId == null) {
    return (
      <div style={{ fontSize: 12, color: '#888', background: '#F9F9F9', border: '1px dashed #D0D0D0', borderRadius: 4, padding: '10px 12px' }}>
        💡 Save this record first, then re-open it to add clients & partners.
      </div>
    );
  }

  const remove = async (cid: number) => {
    if (!confirm('Remove this client?')) return;
    await api.delete(`/admin/businesses/${recordId}/clients/${cid}`);
    load();
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, marginBottom: 8 }}>
        {rows.map((c) => (
          <div key={c.id} style={{ border: '1px solid #E0E0E0', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
            {c.logo
              ? <img src={c.logoUrl || c.logo} alt="" style={{ width: '100%', height: 56, objectFit: 'contain', display: 'block', background: '#FAFAFA', padding: 4, boxSizing: 'border-box' }} />
              : <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0EEFB', color: '#6C5CE7', fontWeight: 800, fontSize: 20 }}>{String(c.name)[0]?.toUpperCase()}</div>}
            <div style={{ padding: '6px 8px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
              <div style={{ fontSize: 10, color: '#999', marginTop: 1 }}>#{c.sort_order ?? 0}{c.website ? ' · 🔗' : ''}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                <button type="button" onClick={() => setEditing(c)} style={{ flex: 1, fontSize: 10.5, padding: '3px 0', border: '1px solid #C8C8C8', background: '#fff', borderRadius: 3, cursor: 'pointer', color: '#333' }}>Edit</button>
                <button type="button" onClick={() => remove(c.id)} style={{ fontSize: 10.5, padding: '3px 8px', border: '1px solid #E8B4B4', background: '#fff', borderRadius: 3, cursor: 'pointer', color: '#C42B1C' }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {rows.length === 0 && <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>No clients yet — the public page shows sample names until you add real ones.</div>}
      <button type="button" onClick={() => setEditing({})}
        style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', border: '1px solid #C8C8C8', background: '#fff', borderRadius: 4, cursor: 'pointer', color: '#0067C0' }}>
        + Add Client
      </button>
      {editing !== null && (
        <ClientForm recordId={recordId} client={editing.id ? editing : null}
          onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}

function ClientForm({ recordId, client, onClose, onSaved }: { recordId: number; client: any | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(client?.name ?? '');
  const [website, setWebsite] = useState(client?.website ?? '');
  const [sortOrder, setSortOrder] = useState(String(client?.sort_order ?? 0));
  const [logo, setLogo] = useState(client?.logo ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/admin/upload/businesses', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLogo(res.data.filename as string);
    } catch { setErr('Logo upload failed'); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!name.trim()) { setErr('Name is required'); return; }
    setSaving(true); setErr('');
    try {
      const payload = { name: name.trim(), website: website.trim(), logo, sort_order: Number(sortOrder) || 0 };
      if (client) await api.put(`/admin/businesses/${recordId}/clients/${client.id}`, payload);
      else await api.post(`/admin/businesses/${recordId}/clients`, payload);
      onSaved();
    } catch { setErr('Save failed'); setSaving(false); }
  };

  const preview = logo ? (String(logo).startsWith('http') ? logo : `/assets/uploads/businesses/${logo}`) : '';
  const inp: React.CSSProperties = { width: '100%', padding: '7px 9px', border: '1px solid #C8C8C8', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', color: '#1a1a1a' };

  return (
    <div style={{ marginTop: 10, border: '1px solid #B3D1F0', borderRadius: 6, background: '#F7FAFE', padding: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>{client ? 'Edit Client' : 'New Client'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 3 }}>Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={inp} placeholder="Emaar Properties" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 3 }}>Website (optional)</label>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} style={inp} placeholder="https://" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 3 }}>Sort Order</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inp} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 3 }}>Logo</label>
          {preview && <img src={preview} alt="" style={{ width: 46, height: 46, objectFit: 'contain', border: '1px solid #E0E0E0', borderRadius: 4, background: '#fff', display: 'block', marginBottom: 4 }} />}
          <input type="file" accept="image/*" onChange={uploadLogo} style={{ fontSize: 11 }} />
          {uploading && <div style={{ fontSize: 10.5, color: '#616161' }}>Uploading…</div>}
        </div>
      </div>
      {err && <div style={{ fontSize: 11.5, color: '#C42B1C', marginTop: 8 }}>{err}</div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" onClick={save} disabled={saving || uploading}
          style={{ padding: '6px 18px', background: saving ? '#7CA3CC' : '#0067C0', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
          {saving ? 'Saving…' : 'Save Client'}
        </button>
        <button type="button" onClick={onClose} style={{ padding: '6px 14px', background: '#fff', border: '1px solid #C8C8C8', borderRadius: 4, fontSize: 12.5, cursor: 'pointer', color: '#333' }}>Cancel</button>
      </div>
    </div>
  );
}

// ── GalleryUploader (multi-image; attaches to an existing record) ───────────────

function GalleryUploader({ resource, recordId }: { resource: string; recordId: number | null }) {
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (recordId == null) return;
    api.get(`/admin/${resource}/${recordId}/gallery`).then((r) => setImages(r.data.images || [])).catch(() => {});
  }, [resource, recordId]);

  if (recordId == null) {
    return (
      <div style={{ fontSize: 12, color: '#888', background: '#F9F9F9', border: '1px dashed #D0D0D0', borderRadius: 4, padding: '10px 12px' }}>
        💡 Save this record first, then re-open it to add gallery images.
      </div>
    );
  }

  const uploadFiles = async (fl: FileList | null) => {
    if (!fl || !fl.length) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData();
      Array.from(fl).forEach((f) => fd.append('files', f));
      const r = await api.post(`/admin/${resource}/${recordId}/gallery`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImages((prev) => [...prev, ...(r.data.images || [])]);
    } catch { setErr('Upload failed'); }
    finally { setUploading(false); if (fileInput.current) fileInput.current.value = ''; }
  };

  const removeImage = async (imgId: number) => {
    await api.delete(`/admin/${resource}/${recordId}/gallery/${imgId}`);
    setImages((prev) => prev.filter((i) => i.id !== imgId));
  };

  const thumb: React.CSSProperties = { width: 72, height: 72, borderRadius: 5, objectFit: 'cover', border: '1px solid #E0E0E0', display: 'block' };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {images.map((img) => (
          <div key={img.id} style={{ position: 'relative' }}>
            <img src={img.url} alt="" style={thumb} />
            <button type="button" onClick={() => removeImage(img.id)}
              style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#C42B1C', color: '#fff', border: '2px solid #fff', fontSize: 11, cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
          </div>
        ))}
        <button type="button" onClick={() => fileInput.current?.click()}
          style={{ width: 72, height: 72, borderRadius: 5, border: '1px dashed #BBB', background: '#FAFAFA', color: ACCENT, fontSize: 26, cursor: 'pointer' }}>+</button>
        <input ref={fileInput} type="file" accept="image/*" multiple onChange={(e) => uploadFiles(e.target.files)} style={{ display: 'none' }} />
      </div>
      {uploading && <div style={{ fontSize: 11, color: '#616161', marginTop: 5 }}>Uploading…</div>}
      {err && <div style={{ fontSize: 11, color: '#C42B1C', marginTop: 5 }}>{err}</div>}
      {!images.length && !uploading && <div style={{ fontSize: 11, color: '#999', marginTop: 5 }}>No gallery images yet. Click + to upload one or more.</div>}
    </div>
  );
}

// ── CoverMediaManager (multiple images + video for the top slider) ──────────────

function CoverMediaManager({ recordId }: { recordId: number | null }) {
  const [media, setMedia] = useState<{ id: number; type: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (recordId == null) return;
    api.get(`/admin/businesses/${recordId}/cover`).then((r) => setMedia(r.data.media || [])).catch(() => {});
  }, [recordId]);

  if (recordId == null) {
    return <div style={{ fontSize: 12, color: '#888', background: '#F9F9F9', border: '1px dashed #D0D0D0', borderRadius: 4, padding: '10px 12px' }}>💡 Save this business first, then re-open it to add cover images/videos.</div>;
  }

  const uploadFiles = async (fl: FileList | null) => {
    if (!fl || !fl.length) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData();
      Array.from(fl).forEach((f) => fd.append('files', f));
      const r = await api.post(`/admin/businesses/${recordId}/cover`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMedia((prev) => [...prev, ...(r.data.media || [])]);
    } catch (e: any) { setErr(e?.response?.data?.error || 'Upload failed (video max 60MB)'); }
    finally { setUploading(false); if (fileInput.current) fileInput.current.value = ''; }
  };

  const removeItem = async (mid: number) => {
    await api.delete(`/admin/businesses/${recordId}/cover/${mid}`);
    setMedia((prev) => prev.filter((m) => m.id !== mid));
  };

  const thumb: React.CSSProperties = { width: 84, height: 84, borderRadius: 6, objectFit: 'cover', border: '1px solid #E0E0E0', display: 'block', background: '#000' };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {media.map((m) => (
          <div key={m.id} style={{ position: 'relative' }}>
            {m.type === 'video'
              ? <video src={m.url} style={thumb} muted playsInline preload="metadata" />
              : <img src={m.url} alt="" style={thumb} />}
            {m.type === 'video' && <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 10, padding: '1px 5px', borderRadius: 4 }}>▶ video</span>}
            <button type="button" onClick={() => removeItem(m.id)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#C42B1C', color: '#fff', border: '2px solid #fff', fontSize: 11, cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
          </div>
        ))}
        <button type="button" onClick={() => fileInput.current?.click()} style={{ width: 84, height: 84, borderRadius: 6, border: '1px dashed #BBB', background: '#FAFAFA', color: ACCENT, fontSize: 26, cursor: 'pointer' }}>+</button>
        <input ref={fileInput} type="file" accept="image/*,video/*" multiple onChange={(e) => uploadFiles(e.target.files)} style={{ display: 'none' }} />
      </div>
      {uploading && <div style={{ fontSize: 11, color: '#616161', marginTop: 5 }}>Uploading…</div>}
      {err && <div style={{ fontSize: 11, color: '#C42B1C', marginTop: 5 }}>{err}</div>}
      <div style={{ fontSize: 11, color: '#999', marginTop: 5 }}>Images &amp; videos allowed. Videos autoplay (muted) when their slide is active. Drag order = upload order.</div>
    </div>
  );
}

// ── ServicesManager (named sections + items; attaches to an existing business) ──

function ServicesManager({ recordId }: { recordId: number | null }) {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ sectionId: number; item: any | null } | null>(null);

  const load = () => {
    if (recordId == null) return;
    setLoading(true);
    api.get(`/admin/businesses/${recordId}/services`).then((r) => {
      const secs: any[] = r.data.sections || [];
      if ((r.data.ungrouped || []).length) secs.push({ id: 0, title: 'Ungrouped (legacy)', items: r.data.ungrouped, legacy: true });
      setSections(secs);
    }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [recordId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (recordId == null) {
    return <div style={{ fontSize: 12, color: '#888', background: '#F9F9F9', border: '1px dashed #D0D0D0', borderRadius: 4, padding: '10px 12px' }}>💡 Save this business first, then re-open it to add service sections.</div>;
  }
  if (loading) return <div style={{ fontSize: 12, color: '#888' }}>Loading…</div>;

  const addSection = async () => {
    const title = window.prompt('Section name', 'Services & Solutions');
    if (!title) return;
    const r = await api.post(`/admin/businesses/${recordId}/service-sections`, { title });
    setSections((p) => [...p, { id: r.data.id, title: r.data.title, items: [] }]);
  };
  const renameSection = async (sid: number, title: string) => { await api.put(`/admin/businesses/${recordId}/service-sections/${sid}`, { title }); };
  const deleteSection = async (sid: number) => {
    if (!window.confirm('Delete this section and all its items?')) return;
    await api.delete(`/admin/businesses/${recordId}/service-sections/${sid}`);
    setSections((p) => p.filter((s) => s.id !== sid));
  };
  const deleteItem = async (iid: number, sid: number) => {
    if (!window.confirm('Delete this item?')) return;
    await api.delete(`/admin/businesses/${recordId}/service-items/${iid}`);
    setSections((p) => p.map((s) => (s.id === sid ? { ...s, items: s.items.filter((it: any) => it.id !== iid) } : s)));
  };

  const miniBtn: React.CSSProperties = { flex: 1, padding: '3px 0', fontSize: 11, border: '1px solid #D5D5D5', background: '#fff', borderRadius: 3, cursor: 'pointer', color: '#333' };

  return (
    <div>
      {sections.map((sec) => (
        <div key={sec.id} style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: 12, marginBottom: 10, background: '#FBFBFD' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            {sec.legacy
              ? <span style={{ fontSize: 13, fontWeight: 700, color: '#888', flex: 1 }}>{sec.title}</span>
              : <input defaultValue={sec.title} onBlur={(e) => renameSection(sec.id, e.target.value)} style={{ ...inputStyle, flex: 1, fontWeight: 600 }} />}
            {!sec.legacy && <button type="button" onClick={() => deleteSection(sec.id)} style={{ padding: '5px 10px', fontSize: 11, border: '1px solid #F1BBBB', color: '#C42B1C', background: '#FDF3F2', borderRadius: 3, cursor: 'pointer' }}>Delete section</button>}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sec.items.map((it: any) => (
              <div key={it.id} style={{ width: 124, border: '1px solid #E8E8E8', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                {it.image
                  ? <img src={it.imageUrl || (String(it.image).startsWith('http') ? it.image : `/assets/uploads/businesses/${it.image}`)} alt="" style={{ width: '100%', height: 64, objectFit: 'cover', display: 'block' }} />
                  : <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, background: '#F3F3F7' }}>{it.icon || '⚙️'}</div>}
                <div style={{ padding: '6px 8px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                    <button type="button" onClick={() => setEditing({ sectionId: sec.id, item: it })} style={miniBtn}>Edit</button>
                    <button type="button" onClick={() => deleteItem(it.id, sec.id)} style={{ ...miniBtn, color: '#C42B1C' }}>Del</button>
                  </div>
                </div>
              </div>
            ))}
            {!sec.legacy && (
              <button type="button" onClick={() => setEditing({ sectionId: sec.id, item: null })} style={{ width: 124, minHeight: 110, border: '1px dashed #BBB', borderRadius: 8, background: '#FAFAFA', color: ACCENT, fontSize: 13, cursor: 'pointer' }}>+ Add item</button>
            )}
          </div>
        </div>
      ))}
      <button type="button" onClick={addSection} style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, border: `1px solid ${ACCENT}`, color: ACCENT, background: '#fff', borderRadius: 5, cursor: 'pointer' }}>+ Add section</button>
      {editing && (
        <ServiceItemForm recordId={recordId} sectionId={editing.sectionId} item={editing.item}
          onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}

function ServiceItemForm({ recordId, sectionId, item, onClose, onSaved }: { recordId: number; sectionId: number; item: any | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [details, setDetails] = useState(item?.details || '');
  const [icon, setIcon] = useState(item?.icon || '');
  const [image, setImage] = useState(item?.image || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const uploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await api.post('/admin/upload/businesses', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImage(res.data.filename as string);
    } finally { setUploading(false); }
  };

  const save = async () => {
    setSaving(true);
    const payload = { title, description, details, icon, image };
    try {
      if (item) await api.put(`/admin/businesses/${recordId}/service-items/${item.id}`, payload);
      else await api.post(`/admin/businesses/${recordId}/service-sections/${sectionId}/items`, payload);
      onSaved();
    } catch { setSaving(false); }
  };

  const preview = image ? (String(image).startsWith('http') ? image : `/assets/uploads/businesses/${image}`) : '';
  const lbl = (t: string) => <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', margin: '10px 0 4px' }}>{t}</label>;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto', padding: 20, fontFamily: FONT }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{item ? 'Edit Service' : 'New Service'}</h3>
        {lbl('Image (optional — falls back to the icon)')}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {preview && <img src={preview} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #E0E0E0' }} />}
          <input type="file" accept="image/*" onChange={uploadImg} style={{ fontSize: 12 }} />
          {uploading && <span style={{ fontSize: 11, color: '#888' }}>Uploading…</span>}
          {image && <button type="button" onClick={() => setImage('')} style={{ fontSize: 11, color: '#C42B1C', background: 'none', border: 'none', cursor: 'pointer' }}>remove</button>}
        </div>
        {lbl('Icon / Emoji (used if no image)')}
        <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="⚙️" style={inputStyle} />
        {lbl('Title')}
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
        {lbl('Short content (≈2 lines, shown on the card)')}
        <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
        {lbl('Full details (shown in the "view more" popup)')}
        <textarea rows={5} value={details} onChange={(e) => setDetails(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button type="button" onClick={onClose} style={{ padding: '7px 16px', border: '1px solid #C8C8C8', background: '#fff', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button type="button" onClick={save} disabled={saving || !title} style={{ padding: '7px 18px', border: 'none', background: saving || !title ? '#9CB8D8' : ACCENT, color: '#fff', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: saving || !title ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

// ── ProductsManager (Template-2 storefront products; attaches to an existing business) ──

function ProductsManager({ recordId }: { recordId: number | null }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | 'new' | null>(null);

  const load = () => {
    if (recordId == null) return;
    setLoading(true);
    api.get(`/admin/businesses/${recordId}/products`).then((r) => setProducts(r.data.products || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [recordId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (recordId == null) return <div style={{ fontSize: 12, color: '#888', background: '#F9F9F9', border: '1px dashed #D0D0D0', borderRadius: 4, padding: '10px 12px' }}>💡 Save this business first, then re-open it to add products.</div>;
  if (loading) return <div style={{ fontSize: 12, color: '#888' }}>Loading…</div>;

  const delProduct = async (pid: number) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/admin/businesses/${recordId}/products/${pid}`);
    setProducts((p) => p.filter((x) => x.id !== pid));
  };
  const miniBtn: React.CSSProperties = { flex: 1, padding: '3px 0', fontSize: 11, border: '1px solid #D5D5D5', background: '#fff', borderRadius: 3, cursor: 'pointer', color: '#333' };

  return (
    <div>
      <ProductCategoriesManager recordId={recordId} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        {products.map((p) => (
          <div key={p.id} style={{ width: 128, border: '1px solid #E8E8E8', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
            {p.image
              ? <img src={p.imageUrl || (String(p.image).startsWith('http') ? p.image : `/assets/uploads/businesses/${p.image}`)} alt="" style={{ width: '100%', height: 72, objectFit: 'cover', display: 'block' }} />
              : <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: '#F3F3F7' }}>🛍️</div>}
            <div style={{ padding: '6px 8px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{p.category || '—'} · {p.currency || 'AED'} {p.price ?? '—'}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                <button type="button" onClick={() => setEditing(p)} style={miniBtn}>Edit</button>
                <button type="button" onClick={() => delProduct(p.id)} style={{ ...miniBtn, color: '#C42B1C' }}>Del</button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setEditing('new')} style={{ width: 128, minHeight: 118, border: '1px dashed #BBB', borderRadius: 8, background: '#FAFAFA', color: ACCENT, fontSize: 13, cursor: 'pointer' }}>+ Add product</button>
      </div>
      {editing && (
        <ProductForm recordId={recordId} product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}

// ── ProductCategoriesManager (shop filter chips: name + image/icon, editable) ───

function ProductCategoriesManager({ recordId }: { recordId: number }) {
  const [cats, setCats] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | 'new' | null>(null);

  const load = useCallback(() => {
    api.get(`/admin/businesses/${recordId}/product-categories`).then((r) => setCats(r.data.categories || [])).catch(() => {});
  }, [recordId]);
  useEffect(load, [load]);

  const remove = async (cid: number) => {
    if (!confirm('Delete this category? Its products stay but lose the category.')) return;
    await api.delete(`/admin/businesses/${recordId}/product-categories/${cid}`);
    load();
  };

  return (
    <div style={{ marginBottom: 12, padding: '10px 12px', background: '#F8F9FC', border: '1px solid #E8EAF2', borderRadius: 6 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: '#555', marginBottom: 8 }}>PRODUCT CATEGORIES (shop filter chips)</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {cats.map((c) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #DDD', borderRadius: 999, padding: '3px 8px 3px 4px' }}>
            {c.image
              ? <img src={c.imageUrl || c.image} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
              : <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#F0EEFB', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{c.icon || '🏷️'}</span>}
            <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{c.name}</span>
            <button type="button" onClick={() => setEditing(c)} title="Edit" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#0067C0', fontSize: 11, padding: '0 2px' }}>✎</button>
            <button type="button" onClick={() => remove(c.id)} title="Delete" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#C42B1C', fontSize: 11, padding: '0 2px' }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={() => setEditing('new')}
          style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', border: '1px dashed #BBB', background: '#fff', borderRadius: 999, cursor: 'pointer', color: ACCENT }}>
          + Category
        </button>
      </div>
      {editing && (
        <ProductCategoryForm recordId={recordId} cat={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}

function ProductCategoryForm({ recordId, cat, onClose, onSaved }: { recordId: number; cat: any | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(cat?.name ?? '');
  const [icon, setIcon] = useState(cat?.icon ?? '');
  const [image, setImage] = useState(cat?.image ?? '');
  const [sortOrder, setSortOrder] = useState(String(cat?.sort_order ?? 0));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const uploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await api.post('/admin/upload/businesses', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImage(res.data.filename as string);
    } catch { setErr('Upload failed'); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!name.trim()) { setErr('Name is required'); return; }
    setSaving(true); setErr('');
    try {
      const payload = { name: name.trim(), icon: icon.trim(), image, sort_order: Number(sortOrder) || 0 };
      if (cat) await api.put(`/admin/businesses/${recordId}/product-categories/${cat.id}`, payload);
      else await api.post(`/admin/businesses/${recordId}/product-categories`, payload);
      onSaved();
    } catch { setErr('Save failed'); setSaving(false); }
  };

  const preview = image ? (String(image).startsWith('http') ? image : `/assets/uploads/businesses/${image}`) : '';

  return (
    <div style={{ marginTop: 10, border: '1px solid #B3D1F0', borderRadius: 6, background: '#F7FAFE', padding: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>{cat ? `Edit Category — ${cat.name}` : 'New Category'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px', gap: 10 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 3 }}>Name * {cat ? '(renaming updates its products too)' : ''}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Apparel" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 3 }}>Icon (emoji)</label>
          <input value={icon} onChange={(e) => setIcon(e.target.value)} style={inputStyle} placeholder="👗" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 3 }}>Sort Order</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inputStyle} />
        </div>
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        {preview && <img src={preview} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid #E0E0E0' }} />}
        <input type="file" accept="image/*" onChange={uploadImg} style={{ fontSize: 11 }} />
        {uploading && <span style={{ fontSize: 10.5, color: '#616161' }}>Uploading…</span>}
        {image && <button type="button" onClick={() => setImage('')} style={{ fontSize: 11, color: '#C42B1C', background: 'none', border: 'none', cursor: 'pointer' }}>remove image</button>}
      </div>
      {err && <div style={{ fontSize: 11.5, color: '#C42B1C', marginTop: 8 }}>{err}</div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" onClick={save} disabled={saving || uploading}
          style={{ padding: '6px 18px', background: saving ? '#7CA3CC' : '#0067C0', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
          {saving ? 'Saving…' : 'Save Category'}
        </button>
        <button type="button" onClick={onClose} style={{ padding: '6px 14px', background: '#fff', border: '1px solid #C8C8C8', borderRadius: 4, fontSize: 12.5, cursor: 'pointer', color: '#333' }}>Cancel</button>
      </div>
    </div>
  );
}

function ProductForm({ recordId, product, onClose, onSaved }: { recordId: number; product: any | null; onClose: () => void; onSaved: () => void }) {
  const [category, setCategory] = useState(product?.category || '');
  const [cats, setCats] = useState<any[]>([]);
  const [newCat, setNewCat] = useState(false);
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : '');
  const [originalPrice, setOriginalPrice] = useState(product?.original_price != null ? String(product.original_price) : '');
  const [currency, setCurrency] = useState(product?.currency || 'AED');
  const [description, setDescription] = useState(product?.description || '');
  const [image, setImage] = useState(product?.image || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/admin/businesses/${recordId}/product-categories`)
      .then((r) => {
        const list = r.data.categories || [];
        setCats(list);
        // Editing a product whose category isn't managed yet → treat as free text.
        if (product?.category && !list.some((c: any) => c.name === product.category)) setNewCat(true);
      })
      .catch(() => {});
  }, [recordId, product]);

  const uploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await api.post('/admin/upload/businesses', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImage(res.data.filename as string);
    } finally { setUploading(false); }
  };

  const save = async () => {
    setSaving(true);
    const cat = category.trim();
    const payload = { category: cat, name, price, original_price: originalPrice, currency, description, image };
    try {
      // A category typed in rather than picked gets created so it appears in future dropdowns.
      if (cat && !cats.some((c) => c.name === cat)) {
        await api.post(`/admin/businesses/${recordId}/product-categories`, { name: cat }).catch(() => {});
      }
      if (product) await api.put(`/admin/businesses/${recordId}/products/${product.id}`, payload);
      else await api.post(`/admin/businesses/${recordId}/products`, payload);
      onSaved();
    } catch { setSaving(false); }
  };

  const preview = image ? (String(image).startsWith('http') ? image : `/assets/uploads/businesses/${image}`) : '';
  const lbl = (t: string) => <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', margin: '10px 0 4px' }}>{t}</label>;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto', padding: 20, fontFamily: FONT }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{product ? 'Edit Product' : 'New Product'}</h3>
        {lbl('Image')}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {preview && <img src={preview} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4, border: '1px solid #E0E0E0' }} />}
          <input type="file" accept="image/*" onChange={uploadImg} style={{ fontSize: 12 }} />
          {uploading && <span style={{ fontSize: 11, color: '#888' }}>Uploading…</span>}
          {image && <button type="button" onClick={() => setImage('')} style={{ fontSize: 11, color: '#C42B1C', background: 'none', border: 'none', cursor: 'pointer' }}>remove</button>}
        </div>
        {lbl('Category (becomes a filter chip — e.g. "Apparel")')}
        {!newCat ? (
          <select value={category}
            onChange={(e) => {
              if (e.target.value === '__new__') { setNewCat(true); setCategory(''); }
              else setCategory(e.target.value);
            }} style={inputStyle}>
            <option value="">— No category —</option>
            {cats.map((c) => <option key={c.id} value={c.name}>{c.icon ? `${c.icon} ` : ''}{c.name}</option>)}
            <option value="__new__">＋ New category…</option>
          </select>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} placeholder="Type new category name" autoFocus />
            <button type="button" onClick={() => { setNewCat(false); setCategory(''); }}
              style={{ fontSize: 12, padding: '0 10px', border: '1px solid #C8C8C8', background: '#fff', borderRadius: 4, cursor: 'pointer', color: '#555', whiteSpace: 'nowrap' }}>
              pick existing
            </button>
          </div>
        )}
        {lbl('Name')}
        <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 10 }}>
          <div>{lbl('Price')}<input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} /></div>
          <div>{lbl('Original (strike)')}<input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} style={inputStyle} /></div>
          <div>{lbl('Currency')}<input value={currency} onChange={(e) => setCurrency(e.target.value)} style={inputStyle} /></div>
        </div>
        {lbl('Description (shown in the product popup)')}
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button type="button" onClick={onClose} style={{ padding: '7px 16px', border: '1px solid #C8C8C8', background: '#fff', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button type="button" onClick={save} disabled={saving || !name} style={{ padding: '7px 18px', border: 'none', background: saving || !name ? '#9CB8D8' : ACCENT, color: '#fff', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: saving || !name ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

// ── BusinessSearchField ───────────────────────────────────────────────────────

function BusinessSearchField({ value, onChange }: { value: string; onChange: (id: string, name: string) => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ id: number; name: string }[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value && !selectedName) {
      api.get(`/admin/businesses/search?q=${value}`).then((r) => {
        const found = (r.data as { id: number; name: string }[]).find((b) => String(b.id) === String(value));
        if (found) setSelectedName(found.name);
      }).catch(() => {});
    }
  }, [value]); // selectedName intentionally omitted – init only

  const search = (v: string) => {
    setQ(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (v.length < 2) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/admin/businesses/search?q=${encodeURIComponent(v)}`);
        setResults(res.data);
        setOpen(true);
      } catch { setResults([]); }
    }, 250);
  };

  const select = (b: { id: number; name: string }) => {
    setSelectedName(b.name);
    setQ('');
    setResults([]);
    setOpen(false);
    onChange(String(b.id), b.name);
  };

  const clear = () => { setSelectedName(''); onChange('', ''); };

  return (
    <div style={{ position: 'relative' }}>
      {value && selectedName ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: '1px solid #C8C8C8', borderRadius: 3, background: '#EBF3FB', fontSize: 13 }}>
          <span style={{ flex: 1, color: '#1a1a1a' }}>#{value} — {selectedName}</span>
          <button type="button" onClick={clear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14, lineHeight: 1 }}>✕</button>
        </div>
      ) : (
        <>
          <input
            type="text" value={q} onChange={(e) => search(e.target.value)}
            placeholder={value ? `Business ID: ${value} (type to change)` : 'Type 2+ chars to search…'}
            style={inputStyle}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {open && results.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 3, zIndex: 200, maxHeight: 200, overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {results.map((b) => (
                <div key={b.id} onMouseDown={() => select(b)}
                  style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid #F0F0F0' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#EBF3FB'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}>
                  <span style={{ color: '#888', fontSize: 11, marginRight: 8 }}>#{b.id}</span>{b.name}
                </div>
              ))}
            </div>
          )}
          {open && results.length === 0 && q.length >= 2 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 3, padding: '8px 12px', fontSize: 12, color: '#888', zIndex: 200 }}>
              No businesses found
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── MainCategorySelectField ───────────────────────────────────────────────────

function MainCategorySelectField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'main-categories', 'all'],
    queryFn: () => api.get('/admin/main-categories?page=1&pageSize=100').then((r) => r.data.rows as { id: number; name: string }[]),
  });

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      <option value="">— Select Group —</option>
      {isLoading && <option disabled>Loading…</option>}
      {data?.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
    </select>
  );
}

// ── EventCategorySelectField ──────────────────────────────────────────────────

function EventCategorySelectField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'event-categories', 'all'],
    queryFn: () => api.get('/admin/event-categories?page=1&pageSize=100').then((r) => r.data.rows as { id: number; name: string; icon?: string }[]),
  });

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      <option value="">— Select Category —</option>
      {isLoading && <option disabled>Loading…</option>}
      {data?.map((cat) => <option key={cat.id} value={String(cat.id)}>{cat.icon ? `${cat.icon} ` : ''}{cat.name}</option>)}
    </select>
  );
}

// ── ResourceSelectField (generic id→name select from any admin resource) ──────

function ResourceSelectField({ resource, value, onChange }: { resource: string; value: string; onChange: (v: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'resource-options', resource],
    queryFn: () => api.get(`/admin/${resource}?page=1&pageSize=1000`).then((r) => r.data.rows as { id: number; name: string; icon?: string }[]),
  });
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      <option value="">— Select —</option>
      {isLoading && <option disabled>Loading…</option>}
      {data?.map((o) => <option key={o.id} value={String(o.id)}>{o.icon ? `${o.icon} ` : ''}{o.name}</option>)}
    </select>
  );
}

// ── UniversitySelectField (businesses that are universities) ───────────────────

function UniversitySelectField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'universities-meta'],
    queryFn: () => api.get('/admin/universities/meta').then((r) => r.data.universities as { id: number; name: string }[]),
  });
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      <option value="">— Select University —</option>
      {isLoading && <option disabled>Loading…</option>}
      {data?.map((o) => <option key={o.id} value={String(o.id)}>{o.name}</option>)}
    </select>
  );
}

// ── CategorySearchField ───────────────────────────────────────────────────────

function CategorySearchField({ value, onChange }: { value: string; onChange: (id: string, name: string, icon?: string) => void }) {
  const [q, setQ] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['admin', 'business-categories', 'all'],
    queryFn: () => api.get('/admin/business-categories?page=1&pageSize=500').then((r) => r.data.rows as { id: number; name: string; icon?: string }[]),
  });

  useEffect(() => {
    if (value && !selectedName && data) {
      const cat = data.find((c) => String(c.id) === String(value));
      if (cat) setSelectedName(cat.name);
    }
  }, [value, data]); // selectedName intentionally omitted – init only

  const filtered = q.length >= 1 ? (data ?? []).filter((c) => c.name.toLowerCase().includes(q.toLowerCase())) : [];

  const select = (c: { id: number; name: string; icon?: string }) => {
    setSelectedName(c.name);
    setQ('');
    setOpen(false);
    onChange(String(c.id), c.name, c.icon);
  };

  const clear = () => { setSelectedName(''); onChange('', ''); };

  return (
    <div style={{ position: 'relative' }}>
      {value && selectedName ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: '1px solid #C8C8C8', borderRadius: 3, background: '#EBF3FB', fontSize: 13 }}>
          <span style={{ flex: 1, color: '#1a1a1a' }}>#{value} — {selectedName}</span>
          <button type="button" onClick={clear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14, lineHeight: 1 }}>✕</button>
        </div>
      ) : (
        <>
          <input
            type="text" value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            placeholder={value ? `Category ID: ${value} (type to change)` : 'Type to search categories…'}
            style={inputStyle}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {open && filtered.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 3, zIndex: 200, maxHeight: 200, overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {filtered.map((c) => (
                <div key={c.id} onMouseDown={() => select(c)}
                  style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid #F0F0F0' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#EBF3FB'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}>
                  <span style={{ color: '#888', fontSize: 11, marginRight: 8 }}>#{c.id}</span>{c.name}
                </div>
              ))}
            </div>
          )}
          {open && filtered.length === 0 && q.length >= 1 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 3, padding: '8px 12px', fontSize: 12, color: '#888', zIndex: 200 }}>
              No categories found
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── UserSearchField ───────────────────────────────────────────────────────────

function UserSearchField({ value, onChange }: { value: string; onChange: (id: string, name: string) => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ id: number; name: string; email: string; mobile: string }[]>([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value && !selectedLabel) {
      api.get(`/admin/users/${value}`).then((r) => {
        const u = r.data;
        setSelectedLabel(`${u.name}${u.email ? ` (${u.email})` : u.mobile ? ` (${u.mobile})` : ''}`);
      }).catch(() => {});
    }
    if (!value) setSelectedLabel('');
  }, [value]); // selectedLabel intentionally omitted – init only

  const search = (v: string) => {
    setQ(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (v.length < 2) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/admin/users/search?q=${encodeURIComponent(v)}`);
        setResults(res.data);
        setOpen(true);
      } catch { setResults([]); }
    }, 250);
  };

  const select = (u: { id: number; name: string; email: string; mobile: string }) => {
    setSelectedLabel(`${u.name}${u.email ? ` (${u.email})` : u.mobile ? ` (${u.mobile})` : ''}`);
    setQ(''); setResults([]); setOpen(false);
    onChange(String(u.id), u.name);
  };

  const clear = () => { setSelectedLabel(''); setQ(''); onChange('', ''); };

  return (
    <div style={{ position: 'relative' }}>
      {value && selectedLabel ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: '1px solid #A5D6A7', borderRadius: 3, background: '#E8F5E9', fontSize: 13 }}>
          <span>👤</span>
          <span style={{ flex: 1, color: '#1a1a1a' }}>#{value} — {selectedLabel}</span>
          <button type="button" onClick={clear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14, lineHeight: 1 }}>✕</button>
        </div>
      ) : (
        <>
          <input
            type="text" value={q} onChange={(e) => search(e.target.value)}
            placeholder={value ? `User ID: ${value} (type to change)` : 'Search by name, email or mobile…'}
            style={inputStyle}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {open && results.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 3, zIndex: 200, maxHeight: 200, overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {results.map((u) => (
                <div key={u.id} onMouseDown={() => select(u)}
                  style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid #F0F0F0' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#E8F5E9'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}>
                  <span style={{ color: '#888', fontSize: 11, marginRight: 8 }}>#{u.id}</span>
                  <strong>{u.name}</strong>
                  {u.email && <span style={{ color: '#888', fontSize: 11, marginLeft: 8 }}>{u.email}</span>}
                  {!u.email && u.mobile && <span style={{ color: '#aaa', fontSize: 11, marginLeft: 8 }}>{u.mobile}</span>}
                </div>
              ))}
            </div>
          )}
          {open && results.length === 0 && q.length >= 2 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 3, padding: '8px 12px', fontSize: 12, color: '#888', zIndex: 200 }}>
              No users found
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── TimePickerField ───────────────────────────────────────────────────────────

function TimePickerField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parseTime = (v: string) => {
    if (!v || v === 'Open 24 Hours') return { h: '', m: '00', ampm: 'AM', fmt24: false, allDay: v === 'Open 24 Hours' };
    const m12 = v.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m12) return { h: m12[1], m: m12[2], ampm: m12[3].toUpperCase(), fmt24: false, allDay: false };
    const m24 = v.match(/^(\d{1,2}):(\d{2})$/);
    if (m24) return { h: m24[1], m: m24[2], ampm: 'AM', fmt24: true, allDay: false };
    return { h: '', m: '00', ampm: 'AM', fmt24: false, allDay: false };
  };

  const init = parseTime(value);
  const [hour, setHour] = useState(init.h);
  const [minute, setMinute] = useState(init.m);
  const [ampm, setAmpm] = useState(init.ampm);
  const [fmt24, setFmt24] = useState(init.fmt24);
  const [allDay, setAllDay] = useState(init.allDay);

  const emit = (h: string, m: string, a: string, f: boolean, ad: boolean) => {
    if (ad) { onChange('Open 24 Hours'); return; }
    if (!h) { onChange(''); return; }
    const hh = h.padStart(2, '0');
    const mm = (m || '00').padStart(2, '0');
    onChange(f ? `${hh}:${mm}` : `${hh}:${mm} ${a}`);
  };

  const hours12 = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const hours24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  const sStyle: React.CSSProperties = { ...inputStyle, width: 64 };

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={hour} disabled={allDay} style={sStyle}
          onChange={(e) => { setHour(e.target.value); emit(e.target.value, minute, ampm, fmt24, allDay); }}>
          <option value="">HH</option>
          {(fmt24 ? hours24 : hours12).map((h) => <option key={h} value={h}>{h}</option>)}
        </select>
        <span style={{ fontWeight: 700, color: '#555', fontSize: 14 }}>:</span>
        <select value={minute} disabled={allDay} style={sStyle}
          onChange={(e) => { setMinute(e.target.value); emit(hour, e.target.value, ampm, fmt24, allDay); }}>
          {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        {!fmt24 && (
          <select value={ampm} disabled={allDay} style={{ ...sStyle, width: 60 }}
            onChange={(e) => { setAmpm(e.target.value); emit(hour, minute, e.target.value, fmt24, allDay); }}>
            <option>AM</option>
            <option>PM</option>
          </select>
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#555', cursor: 'pointer', marginLeft: 4, whiteSpace: 'nowrap' }}>
          <input type="checkbox" checked={fmt24}
            onChange={(e) => { setFmt24(e.target.checked); emit(hour, minute, ampm, e.target.checked, allDay); }} />
          24HR
        </label>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#444', cursor: 'pointer', marginTop: 5 }}>
        <input type="checkbox" checked={allDay}
          onChange={(e) => { setAllDay(e.target.checked); emit(hour, minute, ampm, fmt24, e.target.checked); }} />
        Open 24 Hours
      </label>
      {value && <div style={{ fontSize: 10, color: '#999', marginTop: 3 }}>{value}</div>}
    </div>
  );
}

// ── Dialog (Windows-style modal) ──────────────────────────────────────────────

function CrudDialog({ config, row, onClose, onSaved }: {
  config: ResourceConfig;
  row: Record<string, unknown> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = row !== null;

  const initForm = useCallback((): Record<string, string> => {
    const init: Record<string, string> = {};
    for (const f of config.fields) {
      if (isEdit && row) {
        const v = row[f.key];
        init[f.key] = f.type === 'toggle' ? (v ? '1' : '0') : (v === null || v === undefined ? '' : String(v));
      } else {
        init[f.key] = f.type === 'toggle' ? (f.defaultOn ? '1' : '0') : '';
      }
    }
    return init;
  }, [config, isEdit, row]);

  const [form, setForm] = useState<Record<string, string>>(initForm);
  const [, setBizNames] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string, v: string) => setForm((p) => {
    const next = { ...p, [k]: v };
    const fieldCfg = config.fields.find((f) => f.key === k);
    if (fieldCfg?.syncTo) {
      next[fieldCfg.syncTo] = fieldCfg.syncTransform === 'strip-plus' ? v.replace(/^\+/, '') : v;
    }
    return next;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload: Record<string, unknown> = {};
      for (const f of config.fields) {
        const v = form[f.key];
        if (f.type === 'gallery' || f.type === 'cover' || f.type === 'services' || f.type === 'products' || f.type === 'clients') continue;  // not table columns — managed via their own endpoints
        if (f.type === 'toggle') payload[f.key] = v === '1' ? 1 : 0;
        else if (f.type === 'number' || f.type === 'category-search' || f.type === 'business-search' || f.type === 'user-search' || f.type === 'event-category-select' || f.type === 'resource-select' || f.type === 'university-select') payload[f.key] = v === '' ? null : Number(v);
        else payload[f.key] = v;
      }
      if (isEdit && row) await api.put(`/admin/${config.resource}/${String(row.id)}`, payload);
      else await api.post(`/admin/${config.resource}`, payload);
      onSaved();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Save failed.');
    } finally { setSaving(false); }
  };

  // Group toggle fields at end for cleaner layout
  const textFields = config.fields.filter((f) => f.type !== 'toggle');
  const toggleFields = config.fields.filter((f) => f.type === 'toggle');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', borderRadius: 6, width: '100%', maxWidth: 580, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.2)', fontFamily: FONT, border: '1px solid #C8C8C8' }}>

        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 10px', borderBottom: '1px solid #E5E5E5', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 20, background: ACCENT, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10 }}>
              {isEdit ? '✎' : '+'}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
              {isEdit ? `Edit ${config.label}` : `New ${config.label}`}
            </span>
            {isEdit && row && <span style={{ fontSize: 11, color: '#888', background: '#F3F3F3', padding: '2px 8px', borderRadius: 10 }}>ID: {String(row.id)}</span>}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, background: 'none', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 16, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#C42B1C'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = '#666'; }}>
            ✕
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
          {error && (
            <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '8px 12px', borderRadius: 3, fontSize: 12, marginBottom: 12 }}>
              {error}
            </div>
          )}

          {/* Two-column layout for short fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px 16px' }}>
            {textFields.map((f) => (
              <div key={f.key} style={{ gridColumn: (f.type === 'textarea' || f.type === 'time-picker' || f.type === 'user-search' || f.type === 'business-search' || f.type === 'category-search' || f.type === 'gallery' || f.type === 'cover' || f.type === 'services' || f.type === 'products') ? '1 / -1' : undefined }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 4 }}>
                  {f.label}{f.required && <span style={{ color: '#C42B1C', marginLeft: 2 }}>*</span>}
                </label>

                {f.type === 'text' && (
                  <input type="text" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required} placeholder={f.placeholder} style={inputStyle} />
                )}
                {f.type === 'number' && (
                  <input type="number" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required} style={inputStyle} />
                )}
                {f.type === 'date' && (
                  <input type="date" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} style={inputStyle} />
                )}
                {f.type === 'textarea' && (
                  <textarea rows={4} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required} style={{ ...inputStyle, resize: 'vertical' }} />
                )}
                {f.type === 'select' && (
                  <select value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} style={inputStyle}>
                    <option value="">— Select —</option>
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
                {f.type === 'image' && f.folder && (
                  <ImageUploader folder={f.folder} currentValue={form[f.key] ?? ''} onChange={(fn) => set(f.key, fn)} />
                )}
                {f.type === 'video' && f.folder && (
                  <VideoUploader folder={f.folder} currentValue={form[f.key] ?? ''} onChange={(fn) => set(f.key, fn)} />
                )}
                {f.type === 'media' && f.folder && (
                  <MediaUploader folder={f.folder} currentValue={form[f.key] ?? ''} onChange={(fn) => set(f.key, fn)} />
                )}
                {f.type === 'map-link' && (
                  <div>
                    <input type="text" value={form[f.key] ?? ''} placeholder={f.placeholder} style={inputStyle}
                      onChange={(e) => {
                        let v = e.target.value;
                        const iframeSrc = v.match(/<iframe[^>]*src=["']([^"']+)["']/i);
                        if (iframeSrc) v = iframeSrc[1]; // pasted full <iframe> code → keep just the URL
                        set(f.key, v);
                        const c = parseLatLng(v);
                        if (c) { set('latitude', String(c.lat)); set('longitude', String(c.lng)); }
                      }} />
                    {(form[f.key] ?? '') !== '' && (() => {
                      const c = parseLatLng(form[f.key] ?? '');
                      return c
                        ? <div style={{ fontSize: 11, color: '#107C10', marginTop: 3 }}>✓ Coordinates detected: {c.lat}, {c.lng} — applied below</div>
                        : <div style={{ fontSize: 11, color: '#C42B1C', marginTop: 3 }}>✕ No coordinates in this link. Use Google Maps → Share → Embed a map, or a link containing @lat,lng</div>;
                    })()}
                  </div>
                )}
                {f.type === 'gallery' && (
                  <GalleryUploader resource={config.resource} recordId={isEdit && row ? Number(row.id) : null} />
                )}
                {f.type === 'cover' && (
                  <CoverMediaManager recordId={isEdit && row ? Number(row.id) : null} />
                )}
                {f.type === 'services' && (
                  <ServicesManager recordId={isEdit && row ? Number(row.id) : null} />
                )}
                {f.type === 'products' && (
                  <ProductsManager recordId={isEdit && row ? Number(row.id) : null} />
                )}
                {f.type === 'clients' && (
                  <ClientsManager recordId={isEdit && row ? Number(row.id) : null} />
                )}
                {f.type === 'business-search' && (
                  <BusinessSearchField
                    value={form[f.key] ?? ''}
                    onChange={(id, name) => { set(f.key, id); setBizNames((p) => ({ ...p, [f.key]: name })); }}
                  />
                )}
                {f.type === 'main-category-select' && (
                  <MainCategorySelectField value={form[f.key] ?? ''} onChange={(v) => set(f.key, v)} />
                )}
                {f.type === 'event-category-select' && (
                  <EventCategorySelectField value={form[f.key] ?? ''} onChange={(v) => set(f.key, v)} />
                )}
                {f.type === 'resource-select' && f.optionsResource && (
                  <ResourceSelectField resource={f.optionsResource} value={form[f.key] ?? ''} onChange={(v) => set(f.key, v)} />
                )}
                {f.type === 'university-select' && (
                  <UniversitySelectField value={form[f.key] ?? ''} onChange={(v) => set(f.key, v)} />
                )}
                {f.type === 'category-search' && (
                  <CategorySearchField
                    value={form[f.key] ?? ''}
                    onChange={(id, name, icon) => {
                      set(f.key, id);
                      setBizNames((p) => ({ ...p, [f.key]: name }));
                      if (f.syncNameTo) setForm((p) => ({ ...p, [f.syncNameTo!]: name }));
                      if (f.syncIconTo && icon) setForm((p) => ({ ...p, [f.syncIconTo!]: icon }));
                    }}
                  />
                )}
                {f.type === 'time-picker' && (
                  <TimePickerField key={`${f.key}-tp`} value={form[f.key] ?? ''} onChange={(v) => set(f.key, v)} />
                )}
                {f.type === 'user-search' && (
                  <UserSearchField value={form[f.key] ?? ''} onChange={(id) => set(f.key, id)} />
                )}
              </div>
            ))}
          </div>

          {/* Toggle switches in a row */}
          {toggleFields.length > 0 && (
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 14, padding: '10px 12px', background: '#F9F9F9', borderRadius: 4, border: '1px solid #E5E5E5' }}>
              {toggleFields.map((f) => {
                const on = form[f.key] === '1';
                return (
                  <label key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                    <div onClick={() => set(f.key, on ? '0' : '1')} style={{ width: 36, height: 20, borderRadius: 10, background: on ? ACCENT : '#C8C8C8', position: 'relative', cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left 0.15s' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{f.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </form>

        {/* Action bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #E5E5E5', flexShrink: 0, background: '#F9F9F9', borderRadius: '0 0 6px 6px' }}>
          <button type="button" onClick={onClose} style={{ padding: '6px 20px', border: '1px solid #C8C8C8', borderRadius: 3, background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#333' }}>
            Cancel
          </button>
          <button onClick={handleSubmit as unknown as React.MouseEventHandler} disabled={saving} style={{ padding: '6px 20px', border: 'none', borderRadius: 3, background: saving ? '#7CA3CC' : ACCENT, color: '#fff', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {saving ? 'Saving…' : isEdit ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FilterSelect ──────────────────────────────────────────────────────────────

function FilterSelect({ filter, value, onChange }: { filter: FilterConfig; value: string; onChange: (v: string) => void }) {
  const { data } = useQuery({
    queryKey: ['admin', 'filter-options', filter.optionsFrom],
    queryFn: () => api.get(`/admin/${filter.optionsFrom}?page=1&pageSize=1000`).then((r) => r.data.rows as { id: number; name: string }[]),
    enabled: filter.optionsFrom !== 'emirates',
  });
  const options = filter.optionsFrom === 'emirates'
    ? EMIRATES.map((e) => ({ value: e, label: e }))
    : (data ?? []).map((o) => ({ value: String(o.id), label: o.name }));

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 150, maxWidth: 220 }}>
      <option value="">All {filter.label}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminCrudPage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const resourceKey = location.pathname.replace(/\/$/, '').split('/').pop() ?? '';
  const config = RESOURCE_CONFIGS[resourceKey];

  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [modalRow, setModalRow] = useState<Record<string, unknown> | null | 'new'>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Reset list state when switching between resources.
  useEffect(() => { setPage(1); setSearchInput(''); setSearch(''); setFilters({}); }, [resourceKey]);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const setFilter = (k: string, v: string) => { setFilters((p) => ({ ...p, [k]: v })); setPage(1); };

  const buildQuery = (pg: number, ps: number) => {
    const p = new URLSearchParams({ page: String(pg), pageSize: String(ps) });
    if (search) p.set('search', search);
    Object.entries(filters).forEach(([k, v]) => { if (v) p.set(k, v); });
    return p.toString();
  };

  const queryKey = ['admin', resourceKey, page, search, filters];
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => api.get(`/admin/${resourceKey}?${buildQuery(page, pageSize)}`).then((r) => r.data as { rows: Record<string, unknown>[]; total: number }),
    enabled: !!config,
  });

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get(`/admin/${resourceKey}?${buildQuery(1, 10000)}`);
      const allRows: Record<string, unknown>[] = res.data.rows;
      if (!allRows.length) { alert('No data to export.'); return; }
      const keys = Object.keys(allRows[0]).filter((k) => k !== 'imageUrl');
      const headers = keys.map((k) => config.fields.find((f) => f.key === k)?.label ?? k);
      const escape = (v: unknown) => `"${String(v === null || v === undefined ? '' : v).replace(/"/g, '""')}"`;
      const csv = [headers.map(escape).join(','), ...allRows.map((r) => keys.map((k) => escape(r[k])).join(','))].join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
      const a = document.createElement('a');
      a.href = url; a.download = `${resourceKey}-export.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Export failed.'); }
    finally { setExporting(false); }
  };

  const handleDelete = async (id: unknown) => {
    if (!window.confirm(`Delete record #${id}?`)) return;
    try {
      await api.delete(`/admin/${resourceKey}/${String(id)}`);
      queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] });
    } catch { alert('Delete failed.'); }
  };

  const handleSaved = () => {
    setModalRow(null);
    queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] });
  };

  if (!config) return <div style={{ padding: 32, fontFamily: FONT }}>Unknown resource: <strong>{resourceKey}</strong></div>;

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const thStyle: React.CSSProperties = { padding: '7px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#444', borderBottom: '1px solid #DCDCDC', background: '#F3F3F3', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { padding: '7px 12px', fontSize: 13, borderBottom: '1px solid #EBEBEB', verticalAlign: 'middle' };

  return (
    <div style={{ fontFamily: FONT }}>

      {/* Command bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, background: '#fff', border: '1px solid #E5E5E5', borderRadius: 4, padding: '8px 12px' }}>
        <button onClick={() => setModalRow('new')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>+</span> New {config.label.replace(/s$/, '')}
        </button>
        <button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] })} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: '#fff', color: '#333', border: '1px solid #C8C8C8', borderRadius: 3, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          ↻ Refresh
        </button>
        <button onClick={handleExport} disabled={exporting} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: '#fff', color: exporting ? '#aaa' : '#333', border: '1px solid #C8C8C8', borderRadius: 3, fontSize: 13, cursor: exporting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {exporting ? '…' : '↓'} Export CSV
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}>
          {total > 0 && <>{total} record{total !== 1 ? 's' : ''}</>}
        </div>
      </div>

      {/* Search & filter bar */}
      {(config.searchable || config.filters) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, background: '#fff', border: '1px solid #E5E5E5', borderRadius: 4, padding: '8px 12px', flexWrap: 'wrap' }}>
          {config.searchable && (
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 12, pointerEvents: 'none' }}>🔍</span>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={`Search ${config.label.toLowerCase()}…`}
                style={{ ...inputStyle, width: 240, padding: '6px 26px 6px 30px' }}
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#999', fontSize: 14, lineHeight: 1 }}>✕</button>
              )}
            </div>
          )}
          {config.filters?.map((f) => (
            <FilterSelect key={f.key} filter={f} value={filters[f.key] || ''} onChange={(v) => setFilter(f.key, v)} />
          ))}
          {(search || Object.values(filters).some(Boolean)) && (
            <button
              onClick={() => { setSearchInput(''); setSearch(''); setFilters({}); setPage(1); }}
              style={{ padding: '5px 12px', background: '#fff', color: '#C42B1C', border: '1px solid #E0BDBD', borderRadius: 3, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear
            </button>
          )}
          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}>
            {(search || Object.values(filters).some(Boolean)) ? `${total} match${total !== 1 ? 'es' : ''}` : ''}
          </div>
        </div>
      )}

      {/* Table card */}
      <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 4, overflow: 'hidden' }}>
        {isLoading && (
          <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 13 }}>
            <div style={{ width: 24, height: 24, border: `2px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'win-spin 0.8s linear infinite', margin: '0 auto 8px' }} />
            Loading…
          </div>
        )}
        {isError && (
          <div style={{ padding: 20, color: '#C42B1C', fontSize: 13, background: '#FDF3F2', borderBottom: '1px solid #F1BBBB' }}>
            Failed to load data. Check that the API server is running.
          </div>
        )}
        {!isLoading && !isError && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: 60 }}>ID</th>
                  {(config.listCols ?? [config.displayCol]).map((col) => (
                    <th key={col} style={thStyle}>
                      {config.fields.find((f) => f.key === col)?.label ?? col.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </th>
                  ))}
                  <th style={{ ...thStyle, width: 80, textAlign: 'center' }}>Active</th>
                  <th style={{ ...thStyle, width: 120, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={(config.listCols ?? [config.displayCol]).length + 3} style={{ ...tdStyle, textAlign: 'center', padding: 32, color: '#aaa' }}>
                      No records. Click <strong>New {config.label.replace(/s$/, '')}</strong> to add one.
                    </td>
                  </tr>
                ) : rows.map((row, ri) => {
                  const isActive = row.is_active === 1 || row.is_active === true || row.is_active === '1';
                  const cols = config.listCols ?? [config.displayCol];
                  return (
                    <tr key={String(row.id)} style={{ background: ri % 2 === 1 ? '#FAFAFA' : '#fff' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = '#EBF3FB'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = ri % 2 === 1 ? '#FAFAFA' : '#fff'; }}>
                      <td style={{ ...tdStyle, color: '#888', fontSize: 12, fontFamily: 'monospace' }}>{String(row.id)}</td>
                      {cols.map((col) => {
                        const fieldCfg = config.fields.find((f) => f.key === col);
                        const val = row[col];
                        if ((fieldCfg?.type === 'image' || fieldCfg?.type === 'media') && fieldCfg.folder && val) {
                          const imgSrc = String(val).startsWith('http')
                            ? String(val)
                            : `/assets/uploads/${fieldCfg.folder}/${String(val)}`;
                          return (
                            <td key={col} style={tdStyle}>
                              {isVideoFile(String(val))
                                ? <video src={imgSrc} muted preload="metadata"
                                    style={{ width: 40, height: 32, objectFit: 'cover', borderRadius: 3, border: '1px solid #E0E0E0', background: '#000' }} />
                                : <img src={imgSrc} alt=""
                                    style={{ width: 40, height: 32, objectFit: 'cover', borderRadius: 3, border: '1px solid #E0E0E0' }} />}
                            </td>
                          );
                        }
                        const isDisplayCol = col === config.displayCol;
                        return (
                          <td key={col} style={{ ...tdStyle, fontWeight: isDisplayCol ? 500 : 400, color: isDisplayCol ? '#1a1a1a' : '#555', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {val === null || val === undefined || val === '' ? <span style={{ color: '#ccc' }}>—</span> : String(val)}
                          </td>
                        );
                      })}
                      <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: isActive ? '#107C10' : '#C8C8C8', marginRight: 4 }} />
                        <span style={{ fontSize: 11, color: isActive ? '#107C10' : '#888' }}>{isActive ? 'Yes' : 'No'}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button onClick={() => setModalRow(row)} style={{ padding: '3px 10px', marginRight: 4, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 2, fontSize: 12, cursor: 'pointer', color: '#333', fontFamily: 'inherit' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FB'; (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#C8C8C8'; }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(row.id)} style={{ padding: '3px 10px', background: '#fff', border: '1px solid #C8C8C8', borderRadius: 2, fontSize: 12, cursor: 'pointer', color: '#C42B1C', fontFamily: 'inherit' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FDF3F2'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#C42B1C'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#C8C8C8'; }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', borderTop: '1px solid #E5E5E5', background: '#F9F9F9' }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={{ padding: '4px 12px', border: '1px solid #C8C8C8', borderRadius: 2, background: '#fff', fontSize: 12, cursor: page <= 1 ? 'not-allowed' : 'pointer', color: page <= 1 ? '#aaa' : '#333', fontFamily: 'inherit' }}>
              ‹ Prev
            </button>
            <span style={{ fontSize: 12, color: '#555', padding: '0 8px' }}>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={{ padding: '4px 12px', border: '1px solid #C8C8C8', borderRadius: 2, background: '#fff', fontSize: 12, cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#aaa' : '#333', fontFamily: 'inherit' }}>
              Next ›
            </button>
          </div>
        )}
      </div>

      {/* Dialog */}
      {modalRow !== null && (
        <CrudDialog config={config} row={modalRow === 'new' ? null : modalRow} onClose={() => setModalRow(null)} onSaved={handleSaved} />
      )}

      <style>{`@keyframes win-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
