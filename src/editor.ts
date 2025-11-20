import { LitElement, html, css, CSSResultGroup, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, fireEvent } from 'custom-card-helpers';
import { CalendarUpcomingCardConfig } from './calendar-upcoming-card';

@customElement('calendar-upcoming-card-editor')
export class CalendarUpcomingCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: CalendarUpcomingCardConfig;

  public setConfig(config: CalendarUpcomingCardConfig): void {
    this.config = config;
  }

  private getCalendarEntities(): string[] {
    return Object.keys(this.hass.states).filter((entityId) => entityId.startsWith('calendar.'));
  }

  private valueChanged(ev: CustomEvent): void {
    if (!this.config || !this.hass) {
      return;
    }

    const target = ev.target as any;
    const configValue = target.configValue;
    let value: any = target.value;

    if (target.type === 'number') {
      value = Number(value);
    } else if (target.type === 'checkbox') {
      value = target.checked;
    }

    if (this.config[configValue] === value) {
      return;
    }

    const newConfig = { ...this.config };
    if (value === '' || value === undefined) {
      delete newConfig[configValue];
    } else {
      newConfig[configValue] = value;
    }

    fireEvent(this, 'config-changed', { config: newConfig });
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }

    const calendarEntities = this.getCalendarEntities();

    return html`
      <div class="card-config">
        <div class="option">
          <label for="entity">Calendar Entity (required)</label>
          <select
            id="entity"
            .configValue=${'entity'}
            .value=${this.config.entity || ''}
            @change=${this.valueChanged}
          >
            <option value="">Select a calendar</option>
            ${calendarEntities.map(
              (entity) => html`
                <option value="${entity}" ?selected=${this.config.entity === entity}>
                  ${this.hass.states[entity]?.attributes?.friendly_name || entity}
                </option>
              `
            )}
          </select>
        </div>

        <div class="option">
          <label for="title">Card Title (optional)</label>
          <input
            type="text"
            id="title"
            .configValue=${'title'}
            .value=${this.config.title || ''}
            @input=${this.valueChanged}
            placeholder="Upcoming Events"
          />
        </div>

        <div class="option">
          <label for="max_events">Maximum Events to Show</label>
          <input
            type="number"
            id="max_events"
            .configValue=${'max_events'}
            .value=${this.config.max_events || 5}
            @input=${this.valueChanged}
            min="1"
            max="50"
          />
        </div>

        <div class="option">
          <label for="days_ahead">Days to Look Ahead</label>
          <input
            type="number"
            id="days_ahead"
            .configValue=${'days_ahead'}
            .value=${this.config.days_ahead || 7}
            @input=${this.valueChanged}
            min="1"
            max="365"
          />
        </div>

        <div class="option">
          <label for="layout">Layout</label>
          <select
            id="layout"
            .configValue=${'layout'}
            .value=${this.config.layout || 'vertical'}
            @change=${this.valueChanged}
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>

        <div class="section-title">Past Events</div>

        <div class="option checkbox">
          <label for="show_past_today">
            <input
              type="checkbox"
              id="show_past_today"
              .configValue=${'show_past_today'}
              .checked=${this.config.show_past_today || false}
              @change=${this.valueChanged}
            />
            Show events from start of today
          </label>
        </div>

        <div class="option">
          <label for="show_past_hours">Show Past Events (hours ago)</label>
          <input
            type="number"
            id="show_past_hours"
            .configValue=${'show_past_hours'}
            .value=${this.config.show_past_hours || 0}
            @input=${this.valueChanged}
            min="0"
            max="72"
            ?disabled=${this.config.show_past_today}
          />
          <span class="helper-text">Set to 0 to show only future events</span>
        </div>

        <div class="section-title">Display Options</div>

        <div class="option checkbox">
          <label for="show_time">
            <input
              type="checkbox"
              id="show_time"
              .configValue=${'show_time'}
              .checked=${this.config.show_time !== false}
              @change=${this.valueChanged}
            />
            Show event time
          </label>
        </div>

        <div class="option checkbox">
          <label for="show_date">
            <input
              type="checkbox"
              id="show_date"
              .configValue=${'show_date'}
              .checked=${this.config.show_date !== false}
              @change=${this.valueChanged}
            />
            Show event date
          </label>
        </div>

        <div class="option checkbox">
          <label for="show_location">
            <input
              type="checkbox"
              id="show_location"
              .configValue=${'show_location'}
              .checked=${this.config.show_location || false}
              @change=${this.valueChanged}
            />
            Show event location
          </label>
        </div>

        <div class="option">
          <label for="time_format">Time Format</label>
          <select
            id="time_format"
            .configValue=${'time_format'}
            .value=${this.config.time_format || '24h'}
            @change=${this.valueChanged}
          >
            <option value="24h">24 Hour (15:30)</option>
            <option value="12h">12 Hour (3:30 PM)</option>
          </select>
        </div>

        <div class="option">
          <label for="date_format">Date Format</label>
          <select
            id="date_format"
            .configValue=${'date_format'}
            .value=${this.config.date_format || 'short'}
            @change=${this.valueChanged}
          >
            <option value="short">Short (Thu, Nov 20)</option>
            <option value="long">Long (Thursday, November 20)</option>
          </select>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .section-title {
        font-weight: 600;
        margin-top: 12px;
        margin-bottom: 4px;
        color: var(--primary-text-color);
      }

      .option {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .option.checkbox {
        flex-direction: row;
        align-items: center;
      }

      .option.checkbox label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      label {
        font-size: 14px;
        color: var(--primary-text-color);
      }

      input[type='text'],
      input[type='number'],
      select {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
      }

      input[type='checkbox'] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .helper-text {
        font-size: 12px;
        color: var(--secondary-text-color);
        font-style: italic;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'calendar-upcoming-card-editor': CalendarUpcomingCardEditor;
  }
}
