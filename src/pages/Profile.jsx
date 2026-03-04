import { useState } from "react";
import { User, Mail, Lock, Edit3, Save, X, Eye, EyeOff, Shield, Camera } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import SessionTimer from "../components/SessionTimer";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
    <div className="p-2.5 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
      <Icon size={18} className="text-violet-600 dark:text-violet-400" />
    </div>
    <div>
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{value}</p>
    </div>
  </div>
);

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (form.newPassword && form.newPassword.length < 6) errs.newPassword = "Password must be at least 6 characters";
    if (form.newPassword && !form.currentPassword) errs.currentPassword = "Current password required";
    if (form.currentPassword && form.currentPassword !== user?.password) errs.currentPassword = "Current password is incorrect";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const updates = { name: form.name, email: form.email };
    if (form.newPassword) updates.password = form.newPassword;
    updateProfile(updates);
    setEditing(false);
    setErrors({});
    setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
  };

  const handleCancel = () => {
    setForm({ name: user?.name || "", email: user?.email || "", currentPassword: "", newPassword: "" });
    setErrors({});
    setEditing(false);
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your personal information and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg mx-auto">
                  <span className="text-3xl font-bold text-white">{initials}</span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <Camera size={14} className="text-gray-500" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                <div className="flex items-center gap-2 justify-center">
                  <Shield size={14} className="text-violet-600 dark:text-violet-400" />
                  <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Account Verified</span>
                </div>
              </div>
              <div className="mt-4">
                <SessionTimer />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Info card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Personal Information</h3>
                {!editing && (
                  <button onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition">
                    <Edit3 size={14} /> Edit
                  </button>
                )}
              </div>

              {!editing ? (
                <div className="space-y-1">
                  <InfoRow icon={User} label="Full Name" value={user?.name} />
                  <InfoRow icon={Mail} label="Email Address" value={user?.email} />
                  <InfoRow icon={Lock} label="Password" value="••••••••••" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text"
                        className={`w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border ${errors.name ? "border-red-400" : "border-gray-200 dark:border-gray-700"} rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white text-sm`}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email"
                        className={`w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border ${errors.email ? "border-red-400" : "border-gray-200 dark:border-gray-700"} rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white text-sm`}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Password section */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Change Password <span className="text-gray-400 font-normal">(optional)</span></p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Current Password</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type={showPass ? "text" : "password"}
                            className={`w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border ${errors.currentPassword ? "border-red-400" : "border-gray-200 dark:border-gray-700"} rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500`}
                            placeholder="Enter current password"
                            value={form.currentPassword}
                            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">New Password</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type={showNewPass ? "text" : "password"}
                            className={`w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border ${errors.newPassword ? "border-red-400" : "border-gray-200 dark:border-gray-700"} rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500`}
                            placeholder="Min. 6 characters"
                            value={form.newPassword}
                            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                          />
                          <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md">
                      <Save size={16} /> Save Changes
                    </button>
                    <button onClick={handleCancel}
                      className="flex items-center gap-2 px-5 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Security note */}
            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 rounded-2xl p-5 flex gap-4">
              <Shield size={22} className="text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-violet-900 dark:text-violet-300 mb-1">Security Note</h4>
                <p className="text-xs text-violet-700 dark:text-violet-400 leading-relaxed">
                  Your session automatically expires after 5 minutes for your security. You'll need to login again to continue. Never share your password with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
