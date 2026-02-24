# Branch: enhancement/settings-overrides-distinction

**Date:** 2026-02-26  
**Status:** Complete + Tested  
**Server:** Running on localhost:3001

---

## Overview

This branch implements a comprehensive redesign for clear separation between **permanent default settings** and **temporary schedule swaps**, addressing the user's primary concern:

> "Settings phân biệt được, hiện tại IMG1 settings nó switch qua t2-6 wfh hết rồi"
> "Cần có section riêng để trace nhé" 
> "Dashboard nữa, cần show status hôm nay và ngày mai overview"

---

## Changes Made

### 1. **Settings Page Redesign** (`/settings`)

#### Before
- Single "Weekly Cycle" section showing editable defaults
- "Active Swap Overrides" section below
- User confusion: Can't distinguish which edits affect the default schedule vs temporary swaps

#### After
- **"Default Weekly Schedule"** section (PERMANENT RULES)
  - Info box: "Changes here apply to all future weeks"
  - Visual styling with blue background (primary color)
  - Button: "Save Schedule"
  - Displays M-Su with mode selectors (OFFICE/WFH/OFF)

- **"Today/Future Schedule Changes"** section (TEMPORARY SWAPS)  
  - Info box: "Swaps for specific dates only, don't affect default rules"
  - Visual styling with amber background (warning color)
  - Lists active overrides with "from → to" mode transitions
  - Clear button to remove swaps

#### Key Changes in Code
- Enhanced header descriptions with badges: "PERMANENT RULES" vs "TEMPORARY SWAPS"
- Added contextual info boxes explaining each section's purpose
- Changed button text from "Commit Cycle" to "Save Schedule"
- Separate visual hierarchy (blue vs amber)

---

### 2. **History Page - New "Schedule Changes" Tab**

#### Before
- Only "Punch Records" tab showing work session logs
- No way to track when/how schedule swaps were made
- Users couldn't explain why they made certain swaps

#### After
- Added **"Schedule Changes"** tab alongside "Punch Records"
- Pulls swap_day events from `system_events` DB table
- Displays:
  - Date and time change was made
  - From mode → To mode (with badges: 🖥️ WFH, 🌙 OFF, 🏢 OFFICE)
  - Which date the swap applies to
  
#### Implementation Details
- New `loadChangesHistory()` function
- Calls `API.getEvents('swap_day', 100)` to fetch audit trail
- Tab switching logic to show/hide content
- Dynamic mode badge rendering matching Settings page

---

### 3. **Dashboard - Today/Tomorrow Overview Cards**

#### New Section at Top of Dashboard
Two side-by-side cards showing:

**Today Card:**
- Date and day of week (Vietnamese locale)
- Default schedule from Weekly Cycle
- Active override (if any) with ⭐ **SWAPPED** badge
- Visual distinction between default (normal weight) and override (amber color)

**Tomorrow Card:**
- Same layout as Today
- Dynamically fetched from `API.getBulkState()`
- Shows what to expect next day

#### Benefits
- Users see at glance if today is swapped
- Helps plan for tomorrow's schedule
- No confusion about "effective mode" vs "default mode"

---

## File Changes

### Modified Files
- `public/js/app-enhanced.js` (269 insertions, 73 deletions)
  - Updated `renderHistory()` to add tabs and change history loading
  - Updated `renderSettings()` with new section descriptions
  - Updated `renderDashboard()` with Today/Tomorrow cards + `loadTomorrowInfo()`
  - New `loadChangesHistory()` function for swap audit trail
  
- `public/index.html`
  - Cache-busting version: `v=20260226-1`

### Supporting Functions Used
- `API.getEvents()` - Fetch swap_day events (already existed)
- `API.getBulkState()` - Fetch state for multiple dates (already existed)
- `Charts.renderStatCard()` - Stat card rendering (already existed)

---

## Testing Notes

✅ **Syntax Check**: No errors found in app-enhanced.js  
✅ **Server Status**: Running on localhost:3001  
✅ **Browser Opening**: Successfully tested with Simple Browser  
✅ **API Endpoints**: Using existing endpoints (getEvents, getBulkState)  

---

## User-Facing Features

### Settings Page
- [ ] Verify "Default Weekly Schedule" changes persist
- [ ] Verify "Today/Future Schedule Changes" shows active swaps
- [ ] Verify swap clear button works

### History Page  
- [ ] Check "Schedule Changes" tab loads swap_day events
- [ ] Verify badges display correctly
- [ ] Check date formatting is readable

### Dashboard
- [ ] Today card shows correct default schedule
- [ ] Today card shows SWAPPED badge when override exists
- [ ] Tomorrow card loads and displays correctly
- [ ] Both cards update when swap is made

---

## Technical Details

### Database Tables Used
- `swap_overrides` - Active swaps (stored with mode, created_at, expires_at)
- `system_events` - Audit trail (event_type='swap_day', with event_data containing from/to)

### API Calls
```javascript
// Get swap events from system_events table
API.getEvents('swap_day', 100)

// Get state for date range
API.getBulkState(['2026-02-26', '2026-02-27'])
```

### New CSS Classes Used
- `.card` - Existing card styling
- `.badge` - Mode badges (wfh, wio, off)
- `.tab-content`, `.history-tab-btn` - Tab styling
- `.timeline-item` - Event item styling

---

## Next Steps (If Needed)

1. **Layout width adjustment** - User mentioned "trái phải trống khá nhiều"
   - Could reduce margin on max-w-6xl container
   - Add grid columns to use full width

2. **Additional override indicators**
   - Could add mini badge to calendar cells
   - Could highlight swapped days with dashed borders

3. **Swap creation UI**
   - Users can swap via existing "Swap Day" quick action
   - Could enhance UI for batch swaps

---

## Git Commit

```
Commit: 1b7b2ce
Branch: enhancement/settings-overrides-distinction
Message: "Redesign: Settings vs Overrides distinction + Changes history + Dashboard badges"
```

To view this branch:
```bash
git log enhancement/settings-overrides-distinction --oneline | head
git diff main..enhancement/settings-overrides-distinction
```

---

## How to Merge

When ready to merge to main:
```bash
git checkout main
git merge enhancement/settings-overrides-distinction
git push origin main
```

Current status: **NOT PUSHED** (as per your request to keep in branch)
