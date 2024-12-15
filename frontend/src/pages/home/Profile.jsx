import React from 'react';

const Profile = () => {
    const user = {
        name: "John Doe",
        email: "johndoe@example.com",
        imageUrl: "/src/assets/books/book-12.png",
    };

    return (
        <div className="p-4">
            <div className="flex flex-col items-center">
                <img src={user.imageUrl} alt={user.name} className="w-24 h-24 rounded-full shadow-lg" />
                <h2 className="mt-3 text-lg font-semibold">{user.name}</h2>
                <p>{user.email}</p>
                <div className="mt-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
