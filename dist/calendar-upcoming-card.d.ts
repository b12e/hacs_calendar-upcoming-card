import { LitElement, CSSResultGroup, TemplateResult } from 'lit';
import { HomeAssistant, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';
import './editor';
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
export declare class CalendarUpcomingCard extends LitElement implements LovelaceCard {
    hass: HomeAssistant;
    private config;
    private events;
    static getConfigElement(): LovelaceCardEditor;
    static getStubConfig(): Partial<CalendarUpcomingCardConfig>;
    setConfig(config: CalendarUpcomingCardConfig): void;
    getCardSize(): number;
    protected firstUpdated(): Promise<void>;
    protected updated(changedProps: Map<string, any>): void;
    private loadEvents;
    private getStartTime;
    private getEventStartTime;
    private getEventEndTime;
    private formatDate;
    private formatTime;
    private formatDateTime;
    private isPastEvent;
    private isOngoingEvent;
    protected render(): TemplateResult;
    static get styles(): CSSResultGroup;
}
declare global {
    interface HTMLElementTagNameMap {
        'calendar-upcoming-card': CalendarUpcomingCard;
    }
}
//# sourceMappingURL=calendar-upcoming-card.d.ts.map