import React from 'react';

export default function EmergencyFullscreen() {
  return (
    <div className="w-full h-screen bg-white p-4 overflow-auto">
      <h1 className="text-2xl font-bold text-red-700">Emergency Preparedness Checklist</h1>
      <p className="text-gray-600 mb-4">
        Keep track of essential supplies and recommended food items for emergency situations.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="border border-red-100 rounded-lg p-4">
          <h3 className="font-medium mb-2 text-red-700 border-b border-red-100 pb-1">Batteries & Power</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="battery-1" />
              <label htmlFor="battery-1" className="text-sm">AAA Batteries</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="battery-2" />
              <label htmlFor="battery-2" className="text-sm">AA Batteries</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="battery-3" />
              <label htmlFor="battery-3" className="text-sm">D Batteries</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="battery-4" />
              <label htmlFor="battery-4" className="text-sm">9V Batteries</label>
            </li>
          </ul>
        </div>
        
        <div className="border border-red-100 rounded-lg p-4">
          <h3 className="font-medium mb-2 text-red-700 border-b border-red-100 pb-1">Lighting & Flashlights</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="light-1" />
              <label htmlFor="light-1" className="text-sm">Flashlights</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="light-2" />
              <label htmlFor="light-2" className="text-sm">Candles</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="light-3" />
              <label htmlFor="light-3" className="text-sm">Matches/Lighters</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="light-4" />
              <label htmlFor="light-4" className="text-sm">Battery Lanterns</label>
            </li>
          </ul>
        </div>
        
        <div className="border border-red-100 rounded-lg p-4">
          <h3 className="font-medium mb-2 text-red-700 border-b border-red-100 pb-1">Electronics & Communication</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="elec-1" />
              <label htmlFor="elec-1" className="text-sm">AM/FM Radio (battery-powered)</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="elec-2" />
              <label htmlFor="elec-2" className="text-sm">Portable Phone Charger</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="elec-3" />
              <label htmlFor="elec-3" className="text-sm">Battery-powered Fan</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="elec-4" />
              <label htmlFor="elec-4" className="text-sm">Whistle</label>
            </li>
          </ul>
        </div>
        
        <div className="border border-red-100 rounded-lg p-4">
          <h3 className="font-medium mb-2 text-red-700 border-b border-red-100 pb-1">Cooking & Heating</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="cook-1" />
              <label htmlFor="cook-1" className="text-sm">Propane Stove</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="cook-2" />
              <label htmlFor="cook-2" className="text-sm">Propane Fuel</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="cook-3" />
              <label htmlFor="cook-3" className="text-sm">Manual Can Opener</label>
            </li>
          </ul>
        </div>
        
        <div className="border border-red-100 rounded-lg p-4">
          <h3 className="font-medium mb-2 text-red-700 border-b border-red-100 pb-1">Water & Storage</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="water-1" />
              <label htmlFor="water-1" className="text-sm">Bottled Water (1 gallon per person per day)</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="water-2" />
              <label htmlFor="water-2" className="text-sm">Water Purification Tablets</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="water-3" />
              <label htmlFor="water-3" className="text-sm">Water Storage Containers</label>
            </li>
          </ul>
        </div>
        
        <div className="border border-red-100 rounded-lg p-4">
          <h3 className="font-medium mb-2 text-red-700 border-b border-red-100 pb-1">Other Essentials</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="other-1" />
              <label htmlFor="other-1" className="text-sm">Emergency Contact List</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="other-2" />
              <label htmlFor="other-2" className="text-sm">Cash in Small Denominations</label>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="other-3" />
              <label htmlFor="other-3" className="text-sm">Copies of Important Documents</label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}