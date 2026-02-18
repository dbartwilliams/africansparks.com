
import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Calendar, Link as LinkIcon, MapPin, MoreHorizontal, Mail, Check, Camera } from 'lucide-react';
import Image from '../components/Image';
import SparkCard from "../components/SparkCard";
import { useUser, useToggleConnect,useUpdateUser,useUserSparks } from '../tanstack/queries/usersQueries';
import { getAvatarPath, getSparkCoverImagePath } from '../util/imageKitHelper';

const UserProfile = () => {
  const { id } = useParams();
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useUser(id);
  const { data: userSparks = [], isLoading: isSparksLoading, isError: isSparksError } = useUserSparks(id);
  const { user: currentUser } = useAuthStore();
  const toggleConnect = useToggleConnect(id);
  const updateUser = useUpdateUser();
  
  const [activeTab, setActiveTab] = useState('sparks');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user?.bio || '');
  // const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState(user?.location || '');

  // Check if current user is in target user's connections (they follow you)
  const isConnected = user?.connections?.some(c => c._id === currentUser?._id || c === currentUser?._id);
  const isOwnProfile = currentUser?._id === id;

  const handleSaveBio = async () => {
    const formData = new FormData();
    formData.append('bio', bioInput, 'location', locationInput);
    
    try {
      await updateUser.mutateAsync(formData);
      setIsEditingBio(false);
      // setIsEditingLocation(false);
    } catch (error) {
      alert(error);
    }
  };

  const handleConnectToggle = () => {
    if (!currentUser || toggleConnect.isPending || isOwnProfile) return;
    toggleConnect.mutate();
  };

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelPreview = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('avatar', selectedFile);
  
    try {
      await updateUser.mutateAsync(formData);
      handleCancelPreview();
    } catch (error) {
      alert(error);
    }
  };

  if (isUserLoading) return <p className="mt-4 text-center text-gray-400">Loading profile...</p>;
  if (isUserError || !user) return <p className="mt-4 text-center text-red-500">Error loading profile.</p>;

  if (isSparksLoading) return <p className="mt-4 text-center text-gray-400">Loading profile...</p>;
  if (isSparksError || !user) return <p className="mt-4 text-center text-red-500">Error loading profile.</p>;

  const displayName = `${user.firstName} ${user.lastName}`;
  const handle = `@${user.userName}`;
  
  // Get counts from user data (updated after mutation)
  const connectionsCount = user.connections?.length || 0;
  const connectingsCount = user.connectings?.length || 0;
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const tabs = [
    { id: 'sparks', label: 'Sparks' },
    { id: 'replies', label: 'Replies' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'media', label: 'Media' },
    { id: 'likes', label: 'Likes' },
  ];



  // Determine which avatar to display
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-4 px-4 py-3">
          <button className="p-2 transition-colors rounded-full hover:bg-gray-900">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h2 className="text-lg text-gray-300">{displayName}</h2>
            <p className="text-sm text-gray-500">{user.stats?.sparksCount || 0} sparks</p>
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative h-48 bg-gray-800">
        <Image
          src={getSparkCoverImagePath("default_cover.jpeg")} 
          className="object-cover w-full h-full"       
        />
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex items-start justify-between mb-3 -mt-16">
          <div className="relative group">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {/* Avatar container with click handler for own profile */}
            <div 
              onClick={handleAvatarClick}
              className={`relative ${isOwnProfile ? 'cursor-pointer' : ''}`}
            >
              {/* Use standard img tag for preview, custom Image component for server images */}
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  className="object-cover border-4 border-black rounded-full w-30 h-30"
                  alt="Avatar preview"
                />
              ) : (
                <Image
                src={getAvatarPath(user.userAvatar) || '/default-avatar.png'}
                  className="border-4 border-black rounded-full w-30 h-30"
                  alt="Author"
                />
              )}
              
              {/* Camera overlay for own profile */}
              {isOwnProfile && !avatarPreview && (
                <div className="absolute inset-0 flex items-center justify-center transition-opacity rounded-full opacity-0 bg-black/40 group-hover:opacity-100">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {user.isVerified && (
              <div className="absolute bottom-2 right-2 bg-[#5eeccc] rounded-full p-1">
                <Check className='w-5 h-5 text-black'/>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-20">
            {/* Preview action buttons */}
            {avatarPreview ? (
              <>
                <button
                  onClick={handleCancelPreview}
                  disabled={updateUser.isPending}
                  className="px-4 py-2 font-bold text-white transition-colors bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadAvatar}
                  disabled={updateUser.isPending}
                  className="px-4 py-2 font-bold text-black transition-colors bg-[#5eeccc] rounded hover:bg-[#4dd6b3]  
                  disabled:opacity-50"
                >
                  {updateUser.isPending ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button className="p-2 transition-colors border border-gray-700 rounded-full hover:bg-gray-900">
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 transition-colors border border-gray-700 rounded-full hover:bg-gray-900">
                  <Mail className="w-5 h-5 text-white" />
                </button>
                {!isOwnProfile && (
                  <button
                    onClick={handleConnectToggle}
                    disabled={toggleConnect.isPending}
                    className={`px-6 py-2 font-bold transition-colors cursor-pointer rounded ${
                      isConnected
                        ? 'bg-[#5eeccc] text-black hover:bg-[#4dd6b3]'  // Connected = Green
                        : 'bg-gray-700 text-white hover:bg-gray-600'     // Not connected = Gray
                    }`}
                  >
                    {toggleConnect.isPending ? '...' : isConnected ? 'Connected' : 'Connect'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-lg font-bold text-white">{displayName}</h1>
          <p className="text-gray-500">{handle}</p>
        </div>

            {/* Edit Bio */}
            {isEditingBio ? (
              <div className="mb-4">
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full p-2 text-white bg-gray-800 border border-gray-700 rounded resize-none focus:border-[#5eeccc] focus:outline-none"
                  rows="3"
                  maxLength="160"
                  placeholder="Tell us about yourself..."
                />

                <input type="text" 
                 value={locationInput}
                 onChange={(e) => setLocationInput(e.target.value)} 
                  className="w-full p-2 text-white bg-gray-800 border border-gray-700 rounded resize-none focus:border-[#5eeccc]focus:outline-none"/>


                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveBio}
                    disabled={updateUser.isPending}
                    className="px-4 py-1 text-sm font-bold text-black bg-[#5eeccc] rounded hover:bg-[#4dd6b3] disabled:opacity-50"
                  >
                    {updateUser.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingBio(false);
                      setBioInput(user?.bio || '');
                    }}
                    className="px-4 py-1 text-sm font-bold text-white bg-gray-700 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4 group">
                <p className="px-3 py-4 text-sm text-gray-300 whitespace-pre-wrap rounded bg-slate-800">{user.bio || 'No bio yet'}</p>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="mt-1 text-base transition-opacity rounded buttoncol2"
                  >
                    Edit bio
                  </button>
                )}
              </div>
            )}
            {/* //End Bio */}

        <div className="flex flex-wrap gap-4 mb-4 text-gray-500">
          {user.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}
          {user.website && (
            <div className="flex items-center gap-1">
              <LinkIcon className="w-4 h-4" />
              <a href={`https://${user.website}`} className="text-[#5eeccc] hover:underline">
                {user.website}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        <div className="flex gap-6 mb-4">
          <button className="">
            <span className="px-2 py-1 font-bold text-black bg-[#5eeccc] rounded">
              {connectionsCount.toLocaleString()}
            </span>
            <span className="ml-2 text-gray-500">Connections</span>
          </button>

          <button className="">
            <span className="px-2 py-1 font-bold text-black bg-[#5eeccc] rounded">
              {connectingsCount.toLocaleString()}
            </span>
            <span className="ml-2 text-gray-500">Connectings</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 sticky top-[53px] bg-black/80 backdrop-blur-md z-40">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-center font-medium transition-colors relative hover:bg-gray-900/30 ${
              activeTab === tab.id ? 'text-white' : 'text-gray-500'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#5eeccc] rounded-full" />}
          </button>
        ))}
      </div>

      <div className="p-4 text-gray-500">
      {activeTab === "sparks" && (
          <>
          {userSparks.length > 0 ? (
              userSparks.map((spark) => <SparkCard key={spark._id} spark={spark} />)
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>No sparks yet</p>
              </div>
            )}
          </>
        )}
        {activeTab === 'replies' && <p>No replies yet</p>}
        {activeTab === 'highlights' && <p>No highlights yet</p>}
        {activeTab === 'media' && <p>No media yet</p>}
        {activeTab === 'likes' && <p>No likes yet</p>}
      </div>
    </div>
  );
};

export default UserProfile;