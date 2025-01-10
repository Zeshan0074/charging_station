import React from "react";

const Location = () => {
    return (
        <div className="theropy-background xs:px-2 sm:px-4 md:px-12 lg:px-20 mt-12">
            {/* Search Input */}
            <div className="">
                <h2 className="text-center md:text-start font-semibold text-xl md:text-2xl lg:text-3xl mb-6">
                    Find A Location
                </h2>
                <input
                    type="search"
                    placeholder="Search for a location..."
                    className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Google Map */}
            <div className="w-full">
                <div className="w-full h-[500px]">
                    <iframe
                        title="Dummy Google Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.7810702542566!2d-122.3993466846824!3d37.78675387975728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858093f3f04b47%3A0xa10ac9d169019f1f!2sSalesforce%20Tower!5e0!3m2!1sen!2sus!4v1621512886817!5m2!1sen!2sus"
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Location;
