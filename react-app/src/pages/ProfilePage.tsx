import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

function parseLines(text: string | null): string[] {
  if (!text) return [];
  return text.split(/\\n|\n/).map((s) => s.trim()).filter(Boolean);
}

function parseCommaSep(text: string | null): string[] {
  if (!text) return [];
  return text.split(',').map((s) => s.trim()).filter(Boolean);
}

export default function ProfilePage() {
  const { id = '1' } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => api.get(`/profiles/${id}`).then((r) => r.data),
  });

  const profile = data?.profile;

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>SMART <span className="gradient-text" style={{ fontStyle: 'italic' }}>CV</span></h1>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <div className="skeleton" style={{ width: 96, height: 96, borderRadius: '50%', margin: '0 auto 12px' }}></div>
          <div className="skeleton" style={{ width: 160, height: 20, margin: '0 auto 8px', borderRadius: 8 }}></div>
          <div className="skeleton" style={{ width: 120, height: 14, margin: '0 auto', borderRadius: 8 }}></div>
        </div>
      ) : error || !profile ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#888', marginBottom: 16 }}>No profile found.</p>
          <Link to="/jobs" className="btn-filled">Browse Jobs</Link>
        </div>
      ) : (
        <div style={{ paddingBottom: 80 }}>
          {/* Gradient header */}
          <div className="cv-header">
            <img
              src={profile.photoUrl}
              alt={profile.full_name}
              className="avatar"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'; }}
              loading="lazy" decoding="async"
            />
            <h1>{profile.full_name}</h1>
            {profile.title && <p>{profile.title}</p>}
            {profile.current_company && <p style={{ opacity: 0.8, marginTop: 2 }}>{profile.current_company}</p>}
            <div className="cv-contact">
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>}
              {profile.email && <a href={`mailto:${profile.email}`}><i className="fas fa-envelope"></i></a>}
              {profile.whatsapp && <a href={`https://wa.me/${profile.whatsapp}`} className="whatsapp"><i className="fab fa-whatsapp"></i></a>}
              {profile.phone && <a href={`tel:${profile.phone}`}><i className="fas fa-phone"></i></a>}
            </div>
            {profile.phone && <div className="cv-phone"><i className="fas fa-phone"></i> {profile.phone}</div>}
          </div>

          {/* Experience years badge + location */}
          {(profile.experience_years > 0 || profile.location) && (
            <div className="cv-section">
              <div className="cv-section-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {profile.experience_years > 0 && (
                  <div className="cv-exp-badge">
                    <span className="num">{profile.experience_years}</span>
                    <span className="txt">Years<br/>Experience</span>
                  </div>
                )}
                {profile.location && (
                  <div className="cv-exp-badge">
                    <i className="fas fa-map-marker-alt" style={{ fontSize: 20, color: 'var(--primary)' }}></i>
                    <span className="txt">{profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {profile.work_experience && (
            <div className="cv-section">
              <div className="cv-section-title"><i className="fas fa-briefcase" style={{ marginRight: 8 }}></i>Work Experience</div>
              <div className="cv-section-body">
                {parseLines(profile.work_experience).map((line, i) => {
                  const [title, company, dates, location] = line.split('|').map((s) => s.trim());
                  return (
                    <div className="cv-exp-item" key={i}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
                        {company && <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{company}</div>}
                        {location && <div style={{ fontSize: 11, color: '#888' }}>{location}</div>}
                      </div>
                      {dates && <div style={{ fontSize: 11, color: '#888', textAlign: 'right', flexShrink: 0 }}>{dates}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          {profile.technical_skills && (
            <div className="cv-section">
              <div className="cv-section-title teal"><i className="fas fa-code" style={{ marginRight: 8 }}></i>Technical Skills</div>
              <div className="cv-section-body">
                <div className="cv-skill-grid">
                  {parseCommaSep(profile.technical_skills).map((skill, i) => (
                    <div className="cv-skill-item" key={i}>{skill}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Education */}
          {(profile.education_details || profile.education) && (
            <div className="cv-section">
              <div className="cv-section-title green"><i className="fas fa-graduation-cap" style={{ marginRight: 8 }}></i>Education</div>
              <div className="cv-section-body">
                {profile.education_details
                  ? parseLines(profile.education_details).map((line, i) => {
                      const [degreeUniv, years] = line.split('|').map((s) => s.trim());
                      const [degree, univPlace] = (degreeUniv || '').split('@').map((s) => s.trim());
                      return (
                        <div className="cv-exp-item" key={i}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{degree}</div>
                            {univPlace && <div style={{ fontSize: 12, color: '#555' }}>{univPlace}</div>}
                          </div>
                          {years && <div style={{ fontSize: 11, color: '#888', textAlign: 'right', flexShrink: 0 }}>{years}</div>}
                        </div>
                      );
                    })
                  : <p>{profile.education}</p>
                }
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.certifications && (
            <div className="cv-section">
              <div className="cv-section-title orange"><i className="fas fa-certificate" style={{ marginRight: 8 }}></i>Certifications</div>
              <div className="cv-section-body">
                {parseLines(profile.certifications).map((cert, i) => (
                  <div className="cv-exp-item" key={i} style={{ borderBottom: i < parseLines(profile.certifications).length - 1 ? undefined : 'none' }}>
                    <div style={{ fontSize: 14 }}><i className="fas fa-check-circle" style={{ color: 'var(--primary)', marginRight: 8 }}></i>{cert}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {profile.projects && (
            <div className="cv-section">
              <div className="cv-section-title purple"><i className="fas fa-project-diagram" style={{ marginRight: 8 }}></i>Projects</div>
              <div className="cv-section-body">
                {parseLines(profile.projects).map((proj, i) => (
                  <div className="cv-exp-item" key={i}>
                    <div style={{ fontSize: 14 }}><i className="fas fa-chevron-right" style={{ color: 'var(--primary)', marginRight: 8, fontSize: 11 }}></i>{proj}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile.languages && (
            <div className="cv-section">
              <div className="cv-section-title"><i className="fas fa-language" style={{ marginRight: 8 }}></i>Languages</div>
              <div className="cv-section-body">
                <div className="cv-skill-grid">
                  {parseCommaSep(profile.languages).map((lang, i) => (
                    <div className="cv-skill-item" key={i}>{lang}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
