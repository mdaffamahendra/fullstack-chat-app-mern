import React from 'react'

const AuthImagePattern = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-base-200 pt-24 py-12 pb-12">
        <div className="max-w-md text-center">
          {/* Grid berisi 3 kolom dan 9 elemen berbentuk kotak */}
          <div className="grid grid-cols-3 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-primary/10 ${
                  i % 2 === 0 ? "animate-pulse" : ""
                }`}
              />
            ))}
          </div>
  
          {/* Judul utama */}
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
  
          {/* Subjudul atau deskripsi */}
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthImagePattern;
  
