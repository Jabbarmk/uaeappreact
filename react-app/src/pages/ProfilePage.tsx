import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

export default function ProfilePage() {
  const { id = '1' } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
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
        <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : profile ? (
        <>
          <div className="cv-header">
            <img src={profile.photoUrl} alt={profile.full_name} className="avatar"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'; }}
              loading="lazy" decoding="async" />
            <h1>{profile.full_name}</h1>
            <p>{profile.title}</p>
            <div className="cv-contact">
              {profile.linkedin && <a href={profile.linkedin}><i className="fab fa-linkedin"></i></a>}
              {profile.email && <a href={`mailto:${profile.email}`}><i className="fas fa-envelope"></i></a>}
              {profile.whatsapp && <a href={`https://wa.me/${profile.whatsapp}`} className="whatsapp"><i className="fab fa-whatsapp"></i></a>}
              {profile.phone && <a href={`tel:${profile.phone}`}><i className="fas fa-phone"></i></a>}
            </div>
            {profile.phone && <div className="cv-phone"><i className="fas fa-phone"></i> {profile.phone}</div>}
          </div>
        </>
      ) : (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p>No profile found.</p>
          <Link to="/jobs">Browse Jobs</Link>
        </div>
      )}
    </>
  );
}
