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
6. Restart Home Assistant

### Manual Installation

1. Download the `calendar-upcoming-card.js` file from the latest release
2. Copy it to your `config/www` folder
3. Add the resource in your Lovelace dashboard:
   - Go to Settings → Dashboards → Resources
   - Click "Add Resource"
   - URL: `/local/calendar-upcoming-card.js`
   - Resource type: JavaScript Module

## Building from Source

```bash
npm install
npm run build
```

The compiled file will be in `dist/calendar-upcoming-card.js`.

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

## Examples

### Basic Configuration

```yaml
type: custom:calendar-upcoming-card
entity: calendar.personal
title: My Calendar
```

### Show Last 3 Hours and Next 2 Days

```yaml
type: custom:calendar-upcoming-card
entity: calendar.work
title: Work Schedule
max_events: 10
days_ahead: 2
show_past_hours: 3
```

### Show All Today's Events

```yaml
type: custom:calendar-upcoming-card
entity: calendar.family
title: Today's Events
show_past_today: true
days_ahead: 1
```

### Horizontal Layout

```yaml
type: custom:calendar-upcoming-card
entity: calendar.events
layout: horizontal
max_events: 3
show_location: true
```

### 12-Hour Time with Long Dates

```yaml
type: custom:calendar-upcoming-card
entity: calendar.personal
time_format: 12h
date_format: long
```

## Screenshots

The card displays events similar to your reference image, with:
- Clean, rounded event cards
- Color-coded left border (accent color)
- Event title, date/time, and optional location
- Hover effects for better UX
- Past events shown with reduced opacity

## Theme Support

The card uses Home Assistant's theme variables for colors:
- `--primary-color`: Event card background
- `--accent-color`: Left border color
- `--primary-text-color`: Title text
- `--secondary-text-color`: Date/time text
- `--disabled-text-color`: Past event borders

## Troubleshooting

**Events not showing:**
- Verify the calendar entity ID is correct
- Check that the calendar has events in the configured time range
- Ensure the calendar integration is working properly

**Card not appearing:**
- Clear browser cache
- Verify the resource was added correctly
- Check browser console for errors

**Past events not showing:**
- Ensure `show_past_hours` is set to a value greater than 0, or
- Enable `show_past_today` to show all events from today

## Contributing

Issues and pull requests are welcome!

## License

MIT License
