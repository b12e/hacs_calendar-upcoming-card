import { LitElement, html, css, CSSResultGroup, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';
import './editor';

interface CalendarEvent {
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  summary: string;
  description?: string;
  location?: string;
}

export interface CalendarUpcomingCardConfig extends LovelaceCardConfig {
  type: string;
  entity: string;
  title?: string;
  max_events?: number;
  days_ahead?: number;
  show_past_hours?: number;
  show_past_today?: boolean;
  layout?: 'vertical' | 'horizontal';
  show_time?: boolean;
  show_date?: boolean;
  show_location?: boolean;
  time_format?: '12h' | '24h';
  date_format?: 'short' | 'long';
}

@customElement('calendar-upcoming-card')
export class CalendarUpcomingCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: CalendarUpcomingCardConfig;
  @state() private events: CalendarEvent[] = [];

  public static getConfigElement(): LovelaceCardEditor {
    return document.createElement('calendar-upcoming-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<CalendarUpcomingCardConfig> {
    return {
      entity: '',
      max_events: 5,
      days_ahead: 7,
      show_past_hours: 0,
      show_past_today: false,
      layout: 'vertical',
      show_time: true,
      show_date: true,
      show_location: false,
      time_format: '24h',
      date_format: 'short'
    };
  }

  public setConfig(config: CalendarUpcomingCardConfig): void {
    this.config = {
      max_events: 5,
      days_ahead: 7,
      show_past_hours: 0,
      show_past_today: false,
      layout: 'vertical',
      show_time: true,
      show_date: true,
      show_location: false,
      time_format: '24h',
      date_format: 'short',
      ...config,
    };
  }

  public getCardSize(): number {
    return 3;
  }

  protected async firstUpdated(): Promise<void> {
    await this.loadEvents();
  }

  protected updated(changedProps: Map<string, any>): void {
    super.updated(changedProps);
    if (changedProps.has('hass') || changedProps.has('config')) {
      this.loadEvents();
    }
  }

  private async loadEvents(): Promise<void> {
    if (!this.hass || !this.config.entity) {
      return;
    }

    try {
      const now = new Date();
      const startTime = this.getStartTime(now);
      const endTime = new Date(now);
      endTime.setDate(endTime.getDate() + (this.config.days_ahead || 7));

      const events = await this.hass.callWS<CalendarEvent[]>({
        type: 'calendar/event/get',
        entity_id: this.config.entity,
        start_date_time: startTime.toISOString(),
        end_date_time: endTime.toISOString(),
      });

      this.events = events
        .sort((a, b) => this.getEventStartTime(a).getTime() - this.getEventStartTime(b).getTime())
        .slice(0, this.config.max_events || 5);
    } catch (err) {
      console.error('Error loading calendar events:', err);
      this.events = [];
    }
  }

  private getStartTime(now: Date): Date {
    if (this.config.show_past_today) {
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);
      return startOfToday;
    } else if (this.config.show_past_hours && this.config.show_past_hours > 0) {
      const start = new Date(now);
      start.setHours(start.getHours() - this.config.show_past_hours);
      return start;
    }
    return now;
  }

  private getEventStartTime(event: CalendarEvent): Date {
    return new Date(event.start.dateTime || event.start.date || '');
  }

  private getEventEndTime(event: CalendarEvent): Date {
    return new Date(event.end.dateTime || event.end.date || '');
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (eventDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (eventDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else if (this.config.date_format === 'long') {
      return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    } else {
      return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    }
  }

  private formatTime(date: Date): string {
    if (this.config.time_format === '12h') {
      return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  }

  private formatDateTime(event: CalendarEvent): string {
    const startTime = this.getEventStartTime(event);
    const isAllDay = !event.start.dateTime;

    let result = '';

    if (this.config.show_date) {
      result += this.formatDate(startTime);
    }

    if (this.config.show_time && !isAllDay) {
      if (result) result += ' - ';
      result += this.formatTime(startTime);
    }

    return result;
  }

  private isPastEvent(event: CalendarEvent): boolean {
    const endTime = this.getEventEndTime(event);
    return endTime < new Date();
  }

  protected render(): TemplateResult {
    if (!this.config || !this.hass) {
      return html``;
    }

    if (!this.config.entity) {
      return html`
        <ha-card>
          <div class="card-content vertical">
            <div class="no-events">Please configure a calendar entity</div>
          </div>
        </ha-card>
      `;
    }

    const layout = this.config.layout || 'vertical';

    return html`
      <ha-card>
        ${this.config.title
          ? html`<h1 class="card-header">${this.config.title}</h1>`
          : ''}
        <div class="card-content ${layout}">
          ${this.events.length === 0
            ? html`<div class="no-events">No upcoming events</div>`
            : this.events.map(
                (event) => html`
                  <div class="event ${this.isPastEvent(event) ? 'past' : ''}">
                    <div class="event-content">
                      <div class="event-title">${event.summary}</div>
                      <div class="event-datetime">
                        ${this.formatDateTime(event)}
                      </div>
                      ${this.config.show_location && event.location
                        ? html`<div class="event-location">${event.location}</div>`
                        : ''}
                    </div>
                  </div>
                `
              )}
        </div>
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .card-header {
        padding: 16px;
        font-size: 1.2em;
        font-weight: 500;
        margin: 0;
      }

      .card-content {
        padding: 16px;
        flex: 1;
        overflow-y: auto;
      }

      .card-content.vertical {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .card-content.horizontal {
        display: flex;
        flex-direction: row;
        gap: 12px;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .no-events {
        text-align: center;
        padding: 20px;
        color: var(--secondary-text-color);
        font-style: italic;
      }

      .event {
        background: var(--primary-color);
        border-radius: 8px;
        padding: 12px 16px;
        transition: transform 0.2s, box-shadow 0.2s;
        border-left: 4px solid var(--accent-color);
      }

      .card-content.horizontal .event {
        min-width: 250px;
        flex-shrink: 0;
      }

      .event:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .event.past {
        opacity: 0.6;
        border-left-color: var(--disabled-text-color);
      }

      .event-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .event-title {
        font-weight: 500;
        font-size: 1em;
        color: var(--primary-text-color);
        line-height: 1.4;
      }

      .event-datetime {
        font-size: 0.9em;
        color: var(--secondary-text-color);
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .event-location {
        font-size: 0.85em;
        color: var(--secondary-text-color);
        font-style: italic;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'calendar-upcoming-card': CalendarUpcomingCard;
  }
}

// Register the card
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'calendar-upcoming-card',
  name: 'Calendar Upcoming Card',
  description: 'Display upcoming calendar events with customizable options',
});
