import React, { useState } from 'react';
import Banner from './Banner';
import TopSellers from './TopSellers';
import Recommended from './Recommened'; // Remember to correct the typo in 'Recommened' if it's still there
import News from './News';


import Profile from './Profile';

const Home = () => {
    const [activeSection, setActiveSection] = useState('topSellers'); // default section

    return (
        <>
            <Banner />
            <div className="flex justify-start space-x-4 ml-4 my-4">
                <button 
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${activeSection === 'topSellers' ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'}`} 
                    onClick={() => setActiveSection('topSellers')}
                >
                    Want List
                </button>
                <button 
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${activeSection === 'recommended' ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'}`} 
                    onClick={() => setActiveSection('recommended')}
                >
                    Read List
                </button>
                <button 
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${activeSection === 'news' ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'}`} 
                    onClick={() => setActiveSection('news')}
                >
                    News
                </button>
                <button 
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${activeSection === 'profile' ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'}`} 
                    onClick={() => setActiveSection('profile')}
                >
                    Profile
                </button>
            </div>
            {activeSection === 'topSellers' && <TopSellers />}
            {activeSection === 'recommended' && <Recommended />}
            {activeSection === 'news' && <News />}
            {activeSection === 'profile' && <Profile />}
        </>
    );
};

export default Home;
