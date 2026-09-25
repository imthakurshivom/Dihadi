import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA, CITIES_DATA } from '../../data/mockData';
import { JobType } from '../../types';
import {
  X,
  PlusCircle,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Utensils,
  Home,
  Check,
} from 'lucide-react';

export const PostJobModal: React.FC = () => {
  const {
    isPostJobOpen,
    setIsPostJobOpen,
    currentCity,
    currentArea,
    postJob,
    currentUser,
    setActiveTab,
  } = useApp();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES_DATA[0].id);
  const [workersRequired, setWorkersRequired] = useState(2);
  const [skillsString, setSkillsString] = useState('Brick Work, Plaster, Tile Fixing');
  const [city, setCity] = useState(currentCity);
  const [area, setArea] = useState(currentArea);
  const [date, setDate] = useState('Kal Subah (Tomorrow)');
  const [startTime, setStartTime] = useState('8:30 AM');
  const [expectedDuration, setExpectedDuration] = useState('5 Days');
  const [dailyWage, setDailyWage] = useState(900);
  const [foodProvided, setFoodProvided] = useState(true);
  const [accommodationProvided, setAccommodationProvided] = useState(false);
  const [description, setDescription] = useState('');
  const [contactPreference, setContactPreference] = useState<'call' | 'chat' | 'both'>('both');
  const [jobType, setJobType] = useState<JobType>('daily_wage');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPostJobOpen) return null;

  const selectedCategoryObj = CATEGORIES_DATA.find((c) => c.id === categoryId) || CATEGORIES_DATA[0];

  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const cat = CATEGORIES_DATA.find((c) => c.id === newCatId);
    if (cat) {
      setSkillsString(cat.commonSkills.join(', '));
      if (!title) {
        setTitle(`${workersRequired} ${cat.hindiName} / ${cat.name} Chahiye`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    postJob({
      employerId: currentUser.id,
      employerName: currentUser.name || 'Apna Thekedaar',
      employerPhone: currentUser.phone,
      employerRating: 4.8,
      isEmployerVerified: true,
      title: title || `${workersRequired} ${selectedCategoryObj.name} Chahiye`,
      categoryId,
      categoryName: selectedCategoryObj.name,
      workersRequired: Number(workersRequired) || 1,
      skills: skillsArray.length ? skillsArray : selectedCategoryObj.commonSkills,
      locationCity: city,
      locationArea: area,
      locationPincode: '131001',
      distanceKm: 0.5,
      date,
      startTime,
      expectedDuration,
      dailyWage: Number(dailyWage) || 800,
      foodProvided,
      accommodationProvided,
      description:
        description ||
        `Hume ${workersRequired} ${selectedCategoryObj.name} ki zaroorat hai. Kaam samay par shuru karna hai. Imandari se kaam karne wale worker sampark karein.`,
      contactPreference,
      jobType,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsPostJobOpen(false);
      setActiveTab('home');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-stone-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-stone-900 leading-tight">
              + Kaam Post Karein (Job Post)
            </h2>
            <p className="text-xs text-stone-500">
              Apne area ke workers aur karigaron ko turant bulayein
            </p>
          </div>
          <button
            onClick={() => setIsPostJobOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Kaam Post Ho Gaya!</h3>
            <p className="text-sm text-stone-600">
              Aapka kaam live ho chuka hai. Nearby workers ko notification bhej diya gaya hai.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Category Select */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                Kis Kaam ke liye Workers Chahiye? (Category)
              </label>
              <select
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 focus:outline-none focus:border-orange-500"
              >
                {CATEGORIES_DATA.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name} ({cat.hindiName}) — Average: {cat.avgWage}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Title */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                Kaam Ka Title (Jaise: 2 Mason Chahiye, House Painter Required)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="2 Mason Chahiye Boundary Wall ke liye"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            {/* Workers Count & Daily Wage Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                  Kitne Majdoor Chahiye?
                </label>
                <div className="flex items-center rounded-xl border border-stone-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setWorkersRequired((p) => Math.max(1, p - 1))}
                    className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={workersRequired}
                    onChange={(e) => setWorkersRequired(Number(e.target.value))}
                    className="w-full text-center py-2.5 font-bold text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setWorkersRequired((p) => p + 1)}
                    className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                  Dihadi (₹ / Day / Worker)
                </label>
                <div className="flex rounded-xl border border-stone-300 overflow-hidden focus-within:border-orange-500">
                  <span className="bg-stone-100 px-3 py-2.5 text-xs font-bold text-stone-600 flex items-center">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={dailyWage}
                    onChange={(e) => setDailyWage(Number(e.target.value))}
                    className="w-full px-2 py-2.5 font-bold text-sm focus:outline-none"
                    placeholder="900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location (City & Area) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-semibold"
                >
                  {CITIES_DATA.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                  Area / Mohalla
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Sector 14"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-semibold"
                  required
                />
              </div>
            </div>

            {/* Date & Start Time & Duration */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Kis Din Se?
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Kal Subah"
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="8:30 AM"
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Duration (Kitne Din)
                </label>
                <input
                  type="text"
                  value={expectedDuration}
                  onChange={(e) => setExpectedDuration(e.target.value)}
                  placeholder="5 Days"
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 font-medium"
                />
              </div>
            </div>

            {/* Perks: Food & Accommodation */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                Suvidhayein (Perks)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFoodProvided(!foodProvided)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                    foodProvided
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-stone-200 text-stone-600 bg-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-emerald-600" /> Khana Milega?
                  </span>
                  <span>{foodProvided ? '✓ Haan' : 'Nahi'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccommodationProvided(!accommodationProvided)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                    accommodationProvided
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-stone-200 text-stone-600 bg-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-blue-600" /> Rehna Free?
                  </span>
                  <span>{accommodationProvided ? '✓ Haan' : 'Nahi'}</span>
                </button>
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                Skills / Kaam Ka Anubhav (Comma separated)
              </label>
              <input
                type="text"
                value={skillsString}
                onChange={(e) => setSkillsString(e.target.value)}
                placeholder="Brick Work, Plaster, Tile Fixing"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-medium"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                Kaam Ki Puri Jankari (Description)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kaam ke baare me detail me likhein, jaise: site par cement material aayi hui hai, time par payment milegi..."
                className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            {/* Contact Preference */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                Workers aapse kaise sampark karein?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'both', label: 'Call & Chat Dono' },
                  { id: 'call', label: 'Sirf Call' },
                  { id: 'chat', label: 'Sirf In-App Chat' },
                ].map((pref) => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setContactPreference(pref.id as any)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition ${
                      contactPreference === pref.id
                        ? 'border-orange-500 bg-orange-50 text-orange-900'
                        : 'border-stone-200 text-stone-600 bg-white'
                    }`}
                  >
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-orange-600 text-white font-bold text-base shadow-lg shadow-orange-600/30 hover:bg-orange-700 active:scale-98 transition flex items-center justify-center gap-2 mt-3"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Kaam Post Karein (Live On Dihadi)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
