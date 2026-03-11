<script lang="ts">
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';
  import {
    Mail, MapPin, Link as LinkIcon, FileText, Camera, Loader2,
    Check, Upload, X, User, Shield, Globe, AlertCircle, Building2
  } from 'lucide-svelte';

  let { data, form }: PageProps = $props();

  // Data from server load
  let user = $state(data.user);

  // Form state
  let saving = $state(false);
  let uploadingAvatar = $state(false);

  // Avatar upload state
  let avatarFile = $state<File | null>(null);
  let avatarPreview = $state<string | null>(null);
  let fileInput = $state<HTMLInputElement | null>(null);

  // Form fields (initialized from server data)
  let name = $state(user.name || '');
  let bio = $state(user.bio || '');
  let location = $state(user.location || '');
  let website = $state(user.website || '');

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      avatarFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  function clearAvatarSelection() {
    avatarFile = null;
    avatarPreview = null;
    if (fileInput) fileInput.value = '';
  }

  async function uploadAvatar() {
    if (!avatarFile) return;

    uploadingAvatar = true;

    try {
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('type', 'avatar');

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json() as { success: boolean; url?: string; message?: string };

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload avatar');
      }

      // Update profile with new avatar via API
      const updateRes = await fetch('/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: data.url }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await updateRes.json();
      user = result.user;

      clearAvatarSelection();

    } catch (err: any) {
      console.error('Avatar upload failed:', err);
    } finally {
      uploadingAvatar = false;
    }
  }
</script>

<svelte:head>
  <title>Profile - ZakatApp</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
        <span>Account</span>
        <span>/</span>
        <span class="text-slate-700 dark:text-slate-300">Profile</span>
      </div>
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
      <p class="text-slate-600 dark:text-slate-400 mt-2 font-medium">Manage your account information and preferences.</p>
    </div>

    <div class="space-y-6">
      <!-- Profile Card -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8">
        <div class="flex flex-col sm:flex-row items-start gap-6">
          <div class="relative">
            {#if avatarPreview}
              <img src={avatarPreview} alt="Preview" class="w-24 h-24 rounded-2xl object-cover shadow-lg ring-4 ring-primary-500/20" />
              <button
                onclick={clearAvatarSelection}
                class="absolute -top-2 -right-2 p-2 bg-rose-500 rounded-xl hover:bg-rose-600 transition shadow-lg"
              >
                <X class="w-4 h-4 text-white" />
              </button>
            {:else if user.avatar}
              <img src={user.avatar} alt={user.name} class="w-24 h-24 rounded-2xl object-cover shadow-lg" style="border: 2px solid var(--border-primary);" />
            {:else}
              <div class="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-lg" style="background: linear-gradient(135deg, #34d399, #059669); color: #0a0a0a;">
                {user.name.charAt(0).toUpperCase()}
              </div>
            {/if}

            <button
              onclick={() => fileInput?.click()}
              class="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border-2 border-slate-100 dark:border-slate-700 hover:scale-110 transition"
            >
              <Camera class="w-4 h-4 text-slate-500" />
            </button>

            <input
              type="file"
              bind:this={fileInput}
              onchange={handleFileSelect}
              accept="image/jpeg,image/png,image/gif,image/webp"
              class="hidden"
            />
          </div>

          <div class="flex-1">
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">{user.name}</h2>
            <div class="flex items-center gap-2 mt-2 text-slate-600 dark:text-slate-400 font-medium">
              <Mail class="w-4 h-4" />
              {user.email}
            </div>
            <div class="flex items-center gap-2 mt-4">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Globe class="w-3 h-3" />
                {user.provider === 'google' ? 'Google' : 'Email'}
              </span>
              {#if user.email_verified}
                <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                  <Check class="w-3 h-3" />
                  Verified
                </span>
              {:else}
                <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  <AlertCircle class="w-3 h-3" />
                  Unverified
                </span>
              {/if}
            </div>

            {#if avatarFile}
              <div class="mt-6 flex items-center gap-3">
                <button
                  onclick={uploadAvatar}
                  disabled={uploadingAvatar}
                  class="inline-flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition shadow-lg shadow-primary-500/40 disabled:opacity-50"
                >
                  {#if uploadingAvatar}
                    <Loader2 class="w-4 h-4 animate-spin" />
                    Uploading...
                  {:else}
                    <Upload class="w-4 h-4" />
                    Upload
                  {/if}
                </button>
                <button
                  onclick={clearAvatarSelection}
                  class="px-5 py-2.5 font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Messages -->
      {#if form?.error}
        <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle class="w-4 h-4" />
          {form.error}
        </div>
      {/if}

      {#if form?.success}
        <div class="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center gap-2">
          <Check class="w-4 h-4" />
          Profile updated successfully!
        </div>
      {/if}

      <!-- Edit Form -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8">
        <h3 class="text-xl font-extrabold text-slate-900 dark:text-white mb-6">Edit Profile</h3>

        <form
          method="POST"
          action="?/update"
          use:enhance={() => {
            saving = true;
            return async ({ update }) => {
              await update();
              saving = false;
            };
          }}
          class="space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <User class="w-4 h-4 inline mr-1" />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                bind:value={name}
                required
                class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            <div>
              <label for="location" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <MapPin class="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                bind:value={location}
                maxlength="100"
                class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <label for="bio" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              <FileText class="w-4 h-4 inline mr-1" />
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              bind:value={bio}
              rows="3"
              maxlength="160"
              class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
              placeholder="Tell us about yourself..."
            ></textarea>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right font-medium">{bio?.length || 0}/160</p>
          </div>

          <div>
            <label for="website" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              <LinkIcon class="w-4 h-4 inline mr-1" />
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              bind:value={website}
              class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div class="pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={saving}
              class="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if saving}
                <Loader2 class="w-5 h-5 animate-spin" />
                Saving...
              {:else}
                Save Changes
              {/if}
            </button>
          </div>
        </form>
      </div>

      <!-- Security -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8">
        <h3 class="text-xl font-extrabold text-slate-900 dark:text-white mb-6">Security</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between py-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-slate-700 shadow-sm">
                <Shield class="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p class="font-bold text-slate-900 dark:text-white">Password</p>
                <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Change your account password</p>
              </div>
            </div>
            <a
              href="/forgot-password"
              class="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition"
            >
              Change
            </a>
          </div>

          {#if !user.email_verified}
            <div class="flex items-center justify-between py-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-slate-700 shadow-sm">
                  <Mail class="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white">Email Verification</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Verify your email address</p>
                </div>
              </div>
              <form method="POST" action="/auth/resend-verification">
                <input type="hidden" name="email" value={user.email} />
                <button
                  type="submit"
                  class="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition"
                >
                  Resend
                </button>
              </form>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
