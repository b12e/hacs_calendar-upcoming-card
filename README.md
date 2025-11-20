# Calendar Upcoming Card

A customizable Home Assistant custom card for displaying upcoming calendar events with a clean, modern interface.

## Features

- **Flexible Display Options**: Show events vertically or horizontally
- **Customizable Time Range**: Configure how many days ahead to show and whether to include past events
- **Past Events Support**: Option to show events from today or X hours ago
- **Configurable Appearance**: Choose what information to display (time, date, location)
- **Time & Date Formatting**: Support for 12h/24h time and short/long date formats
- **Visual Indicators**: Past events are shown with reduced opacity
- **Responsive Design**: Works on all screen sizes

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant
2. Go to "Frontend"
3. Click the three dots menu and select "Custom repositories"
4. Add this repository URL with category "Lovelace"
5. Click "Install"
6. Restart Home Assistan

## Configuration

### Visual Editor (Recommended)

The card is **fully configurable through the UI** - no YAML required!

1. In your Home Assistant dashboard, click the 3 dots menu and select "Edit Dashboard"
2. Click "+ Add Card"
3. Search for "Calendar Upcoming Card"
4. The visual editor will open with all configuration options
5. Select your calendar entity from the dropdown
6. Configure all settings through the UI:
   - Maximum events to show
   - Days to look ahead
   - Past events options
   - Layout (vertical/horizontal)
   - Display options (time, date, location)
   - Time and date formatting
7. Click "Save"

All settings are available in the visual editor - you never need to touch YAML!

### YAML Configuration (Optional)

If you prefer YAML, you can also configure the card manually:

```yaml
type: custom:calendar-upcoming-card
entity: calendar.your_calendar
title: Upcoming Events
max_events: 5
days_ahead: 7
show_past_hours: 2
layout: vertical
show_time: true
show_date: true
show_location: false
time_format: 24h
date_format: short
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **Required** | Calendar entity ID (e.g., `calendar.your_calendar`) |
| `title` | string | none | Card title (optional) |
| `max_events` | number | `5` | Maximum number of events to display |
| `days_ahead` | number | `7` | Number of days to look ahead |
| `show_past_hours` | number | `0` | Show events from X hours ago (0 = only future events) |
| `show_past_today` | boolean | `false` | Show all events from the start of today |
| `layout` | string | `vertical` | Layout direction (`vertical` or `horizontal`) |
| `show_time` | boolean | `true` | Display event time |
| `show_date` | boolean | `true` | Display event date |
| `show_location` | boolean | `false` | Display event location |
| `time_format` | string | `24h` | Time format (`24h` or `12h`) |
| `date_format` | string | `short` | Date format (`short` or `long`) |

## Screenshots
### Settings:

<img width="1006" height="848" alt="image" src="https://github.com/user-attachments/assets/7bbc1aef-04b3-4eb2-803f-c655f747ccde" />

### Horizontal layout:

<img width="1345" height="113" alt="image" src="https://github.com/user-attachments/assets/cae7356a-6274-4ebc-8622-7de0b0b06c5f" />

### Vertical layout:

<img width="494" height="501" alt="image" src="https://github.com/user-attachments/assets/050bfa67-827a-4c51-ba2f-8c20676d64e9" />
