import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroSlide } from '../../types';
import { HERO_IMAGE_PRESETS } from '../../data/heroTemplates';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Image as ImageIcon,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

export const HeroSlideshowManager: React.FC = () => {
  const { 
    heroSlides, 
    addHeroSlide, 
    updateHeroSlide, 
    deleteHeroSlide, 
    resetHeroSlides
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state including picture settings
  const [formData, setFormData] = useState<Omit<HeroSlide, 'id'>>({
    badge: 'Chengalpattu District Innovation Mission',
    headlineMain: 'Accelerating High-Impact Engineering with',
    headlineHighlight: 'District-Wide Civic Solutions',
    description: 'Empowering accredited collegiate engineering laboratories to develop, deploy, and benchmark production-grade systems for municipal departments.',
    primaryCtaText: 'Explore Problem Statements',
    primaryCtaAction: 'browse',
    secondaryCtaText: 'Institution Portal',
    secondaryCtaAction: 'about',
    theme: 'sky',
    category: 'District Innovation',
    active: true,
    departmentTag: 'District Collectorate IT Cell',
    imageUrl: HERO_IMAGE_PRESETS[0].url,
    imageAlt: 'Engineering innovation lab',
    imageCaption: HERO_IMAGE_PRESETS[0].caption
  });

  const handleOpenCreate = () => {
    setEditingSlideId(null);
    setFormData({
      badge: 'Chengalpattu District Innovation Mission',
      headlineMain: 'Accelerating High-Impact Engineering with',
      headlineHighlight: 'District-Wide Civic Solutions',
      description: 'Empowering accredited collegiate engineering laboratories to develop, deploy, and benchmark production-grade systems for municipal departments.',
      primaryCtaText: 'Explore Problem Statements',
      primaryCtaAction: 'browse',
      secondaryCtaText: 'Institution Portal',
      secondaryCtaAction: 'about',
      theme: 'sky',
      category: 'District Innovation',
      active: true,
      departmentTag: 'District Collectorate IT Cell',
      imageUrl: HERO_IMAGE_PRESETS[0].url,
      imageAlt: 'Engineering innovation lab',
      imageCaption: HERO_IMAGE_PRESETS[0].caption
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlideId(slide.id);
    setFormData({
      badge: slide.badge,
      headlineMain: slide.headlineMain,
      headlineHighlight: slide.headlineHighlight,
      description: slide.description,
      primaryCtaText: slide.primaryCtaText,
      primaryCtaAction: slide.primaryCtaAction,
      secondaryCtaText: slide.secondaryCtaText,
      secondaryCtaAction: slide.secondaryCtaAction,
      theme: slide.theme,
      category: slide.category,
      active: slide.active,
      departmentTag: slide.departmentTag,
      imageUrl: slide.imageUrl || HERO_IMAGE_PRESETS[0].url,
      imageAlt: slide.imageAlt || 'Slide illustration',
      imageCaption: slide.imageCaption || 'District Engineering Milestone'
    });
    setIsModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlideId) {
      updateHeroSlide(editingSlideId, formData);
    } else {
      addHeroSlide(formData);
    }
    setIsModalOpen(false);
  };

  // Handle direct file upload for picture
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Selected image exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setFormData(prev => ({
          ...prev,
          imageUrl: result,
          imageCaption: prev.imageCaption || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Hero Slideshow & Picture Manager
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Super Admin can curate live slideshow presentations, upload pictures directly, customize headlines, colors, and captions for the homepage hero carousel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Slide</span>
          </button>

          <button
            onClick={resetHeroSlides}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer transition-colors"
            title="Reset to default official slides"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Current Slides List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Active Hero Carousel Slides ({heroSlides.length})
          </h3>
          <span className="text-xs text-slate-500">
            Changes immediately update the home page hero presentation
          </span>
        </div>

        <div className="space-y-4">
          {heroSlides.map((slide, index) => {
            return (
              <div
                key={slide.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
              >
                {/* Slide Picture Thumbnail */}
                <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 shadow-xs">
                  <img 
                    src={slide.imageUrl || HERO_IMAGE_PRESETS[0].url} 
                    alt={slide.imageAlt || slide.headlineMain}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold text-white bg-slate-950/80 px-1 rounded">
                    #{index + 1}
                  </span>
                </div>

                {/* Narrative Info */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      slide.theme === 'amber' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      slide.theme === 'emerald' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      slide.theme === 'purple' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                      slide.theme === 'sky' ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                      'bg-indigo-100 text-indigo-900 border border-indigo-300'
                    }`}>
                      {slide.theme}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 truncate max-w-xs">
                      {slide.departmentTag}
                    </span>
                    {slide.active ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Inactive
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug truncate">
                    <span>{slide.headlineMain} </span>
                    <span className="text-purple-600 underline decoration-purple-300">
                      {slide.headlineHighlight}
                    </span>
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {slide.imageCaption ? `Picture: "${slide.imageCaption}"` : slide.description}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => updateHeroSlide(slide.id, { active: !slide.active })}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      slide.active 
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100' 
                        : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    {slide.active ? 'Disable' : 'Enable'}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Slide & Picture"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteHeroSlide(slide.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit / Create Slide Modal with Upload & Link */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingSlideId ? 'Edit Hero Slide & Picture' : 'Create New Hero Slide & Picture'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              
              {/* Picture Settings Section with Upload & Link */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    Featured Picture (Upload or Paste Link)
                  </label>
                  <span className="text-[11px] text-slate-500">Image file or web link</span>
                </div>

                {/* Upload Button & Link Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Upload from Computer:
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-100 border border-dashed border-blue-400 hover:border-blue-600 text-blue-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose Image File...</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Or Image Web Link:
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      <input
                        type="url"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full text-xs pl-8 pr-2.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Thumbnails */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                    Or select from preset photographs:
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {HERO_IMAGE_PRESETS.map((preset, pIdx) => {
                      const isSelected = formData.imageUrl === preset.url;
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              imageUrl: preset.url,
                              imageCaption: preset.caption,
                              imageAlt: preset.name
                            });
                          }}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          {isSelected && (
                            <span className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white drop-shadow-md" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Picture Caption Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Picture Caption
                  </label>
                  <input
                    type="text"
                    value={formData.imageCaption || ''}
                    onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    placeholder="e.g. Field Prototyping Laboratory · Collegiate Team"
                  />
                </div>

                {/* Picture Live Preview */}
                {formData.imageUrl && (
                  <div className="relative h-32 rounded-xl overflow-hidden border border-slate-200 mt-2 bg-slate-900 shadow-xs">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs p-2 text-[11px] text-white font-medium flex items-center justify-between">
                      <span className="truncate">Caption: {formData.imageCaption || 'No caption'}</span>
                      <span className="text-[10px] text-emerald-400 shrink-0 font-mono">Live Preview</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Badge / Organization Banner
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Chengalpattu District Innovation Mission"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.departmentTag}
                    onChange={(e) => setFormData({ ...formData, departmentTag: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Municipal Administration Department"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Headline (Standard Text)
                </label>
                <input
                  type="text"
                  required
                  value={formData.headlineMain}
                  onChange={(e) => setFormData({ ...formData, headlineMain: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Transforming Urban Utilities Through"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline Highlight (Gradient Phrase)
                </label>
                <input
                  type="text"
                  required
                  value={formData.headlineHighlight}
                  onChange={(e) => setFormData({ ...formData, headlineHighlight: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. IoT & AI Telemetry"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Slide Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  placeholder="Provide context on problem statement, engineering scope, and district impact..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Visual Theme Color
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value as HeroSlide['theme'] })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="amber">Amber / Gold</option>
                    <option value="emerald">Emerald / Green</option>
                    <option value="sky">Cyber Sky / Cyan</option>
                    <option value="indigo">Royal Indigo</option>
                    <option value="purple">Vibrant Purple</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary CTA Text
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.primaryCtaText}
                    onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secondary CTA Text
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.secondaryCtaText}
                    onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  {editingSlideId ? 'Save Changes' : 'Create Slide'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HeroSlideshowManager;
