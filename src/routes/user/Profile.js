import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../../utils/api';
import UserReservation from './UserReservation';
import Modal from '../../tools/Modal';
import UpdatePasswordForm from '../../components/user/UpdatePassword'; 
import { useAuth } from '../../utils/AuthContext';
import UserCoupons from './UserCoupon';
import DeleteUser from '../../components/user/DeleteUser'; 
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false); 
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const { logOut } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('Authorization');

        if (!token) {
          logOut();
          navigate('/login');
          return;
        }

        const response = await apiFetch('/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, logOut]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="profile-container">
      <span className="profile-title">내정보</span>
      <hr />
      {profile ? (
        <div className="profile-info">
          <p className="info-item"><strong>Email:</strong> {profile.email}</p>
          <p className="info-item"><strong>Name:</strong> {profile.name}</p>
          <p className="info-item"><strong>PhoneNumber:</strong> {profile.phoneNumber}</p>
          <p className="info-item"><strong>Birthday:</strong> {profile.birthday}</p>
          <p className="info-item"><strong>Gender:</strong> {profile.gender}</p>
          <button 
            onClick={() => setShowUpdatePassword(true)} 
            className="update-password-button"
          >
            비밀번호 변경
          </button>

          <button 
            onClick={() => setShowDeleteConfirmation(true)} 
            className="delete-account-button"
          >
            계정 삭제
          </button>
          
        </div>
      ) : (
        <p>사용자 프로필을 띄울 수 없습니다.</p>
      )}
      
      <UserReservation />
      <UserCoupons />

      {showUpdatePassword && (
        <Modal onClose={() => setShowUpdatePassword(false)}>
          <UpdatePasswordForm onClose={() => setShowUpdatePassword(false)} />
        </Modal>
      )}

      {showDeleteConfirmation && (
        <DeleteUser onClose={() => setShowDeleteConfirmation(false)} />
      )}
    </div>
  );
};

export default Profile;
