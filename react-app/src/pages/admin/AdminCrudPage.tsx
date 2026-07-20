import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

// ── Types ─────────────────────────────────────────────────────────────────────

type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'toggle' | 'date' | 'image' | 'business-search' | 'main-category-select' | 'category-search' | 'time-picker' | 'user-search' | 'event-category-select' | 'resource-select' | 'university-select';

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
  businesses: { resource: 'businesses', label: 'Businesses', displayCol: 'name', listCols: ['image', 'name', 'emirate', 'phone', 'rating'], searchable: true, filters: [{ key: 'category_id', label: 'Category', optionsFrom: 'business-categories' }, { key: 'emirate', label: 'Emirate', optionsFrom: 'emirates' }], fields: [
    { key: 'user_id',          label: 'Assigned User',    type: 'user-search' },
    { key: 'name',             label: 'Name',             type: 'text',            required: true },
    { key: 'category_id',      label: 'Category',         type: 'category-search' },
    { key: 'tagline',          label: 'Tagline',          type: 'text' },
    { key: 'description',      label: 'Description',      type: 'textarea' },
    { key: 'about',            label: 'About',            type: 'textarea' },
    { key: 'image',            label: 'Cover Image',      type: 'image',           folder: 'businesses' },
    { key: 'logo',             label: 'Logo',             type: 'image',           folder: 'businesses' },
    { key: 'emirate',          label: 'Emirate',          type: 'select',          options: EMIRATES },
    { key: 'address',          label: 'Address',          type: 'text' },
    { key: 'phone',            label: 'Phone',            type: 'text',            placeholder: '+971559164496', syncTo: 'whatsapp', syncTransform: 'strip-plus' },
    { key: 'whatsapp',         label: 'WhatsApp',         type: 'text',            placeholder: '971559164496' },
    { key: 'email',            label: 'Email',            type: 'text' },
    { key: 'website',          label: 'Website',          type: 'text' },
    { key: 'opening_time',     label: 'Opening Time',     type: 'time-picker' },
    { key: 'closing_time',     label: 'Closing Time',     type: 'time-picker' },
    { key: 'rating',           label: 'Rating (0–5)',     type: 'number' },
    { key: 'established_year', label: 'Est. Year',        type: 'number' },
    { key: 'is_active',        label: 'Active',           type: 'toggle' },
  ]},
  offers: { resource: 'offers', label: 'Offers', displayCol: 'title', listCols: ['image', 'title', 'price', 'emirate', 'valid_to'], fields: [
    { key: 'business_id',      label: 'Business ID',      type: 'number', required: true },
    { key: 'title',            label: 'Title',            type: 'text',   required: true },
    { key: 'description',      label: 'Description',      type: 'textarea' },
    { key: 'details',          label: 'Details',          type: 'textarea' },
    { key: 'image',            label: 'Image',            type: 'image', folder: 'offers' },
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
    { key: 'poster',             label: 'Event Poster',    type: 'image', folder: 'events' },
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
  courses: { resource: 'courses', label: 'Courses', displayCol: 'name', listCols: ['name', 'duration', 'emirate'], searchable: true,
    filters: [{ key: 'study_level_id', label: 'Study Level', optionsFrom: 'study-levels' }, { key: 'course_category_id', label: 'Course Category', optionsFrom: 'course-categories' }],
    fields: [
    { key: 'business_id',          label: 'University',            type: 'university-select', required: true },
    { key: 'course_category_id',   label: 'Course Category',       type: 'resource-select', optionsResource: 'course-categories' },
    { key: 'study_level_id',       label: 'Study Level',           type: 'resource-select', optionsResource: 'study-levels' },
    { key: 'name',                 label: 'Course Name',           type: 'text', required: true },
    { key: 'specialisation',       label: 'Specialisation',        type: 'text' },
    { key: 'duration',             label: 'Duration',              type: 'text', placeholder: '3–4 years' },
    { key: 'total_fee',            label: 'Total Tuition Fee',     type: 'number' },
    { key: 'fee_per_year',         label: 'Fee Per Year',          type: 'number' },
    { key: 'currency',             label: 'Currency',              type: 'text' },
    { key: 'study_mode',           label: 'Study Mode',            type: 'select', options: ['Full-time', 'Part-time'] },
    { key: 'delivery',             label: 'Delivery',              type: 'select', options: ['On campus', 'Online', 'Hybrid'] },
    { key: 'location',             label: 'Location',              type: 'text' },
    { key: 'emirate',              label: 'Emirate',               type: 'select', options: EMIRATES },
    { key: 'intake',               label: 'Intake',                type: 'text', placeholder: 'September 2026' },
    { key: 'eligibility',          label: 'Eligibility',           type: 'text' },
    { key: 'application_deadline', label: 'Application Deadline',   type: 'date' },
    { key: 'accreditation',        label: 'Accreditation',         type: 'text' },
    { key: 'scholarships',         label: 'Scholarships',          type: 'select', options: ['Available', 'Not Available'] },
    { key: 'is_featured',          label: 'Featured',              type: 'toggle' },
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
        init[f.key] = f.type === 'toggle' ? '0' : '';
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
              <div key={f.key} style={{ gridColumn: (f.type === 'textarea' || f.type === 'time-picker' || f.type === 'user-search' || f.type === 'business-search' || f.type === 'category-search') ? '1 / -1' : undefined }}>
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
    <div style={{ fontFamily: FONT, maxWidth: 1100 }}>

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
                      {config.fields.find((f) => f.key === col)?.label ?? col}
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
                        if (fieldCfg?.type === 'image' && fieldCfg.folder && val) {
                          const imgSrc = String(val).startsWith('http')
                            ? String(val)
                            : `/assets/uploads/${fieldCfg.folder}/${String(val)}`;
                          return (
                            <td key={col} style={tdStyle}>
                              <img src={imgSrc} alt=""
                                style={{ width: 40, height: 32, objectFit: 'cover', borderRadius: 3, border: '1px solid #E0E0E0' }} />
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
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: isActive ? '#107C10' : '#C8C8C8', marginRight: 4 }} />
                        <span style={{ fontSize: 11, color: isActive ? '#107C10' : '#888' }}>{isActive ? 'Yes' : 'No'}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
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
