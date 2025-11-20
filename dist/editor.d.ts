import { LitElement, CSSResultGroup, TemplateResult } from 'lit';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { CalendarUpcomingCardConfig } from './calendar-upcoming-card';
export declare class CalendarUpcomingCardEditor extends LitElement implements LovelaceCardEditor {
    hass: HomeAssistant;
    private config;
    setConfig(config: CalendarUpcomingCardConfig): void;
    private getCalendarEntities;
    private valueChanged;
    protected render(): TemplateResult;
    static get styles(): CSSResultGroup;
}
declare global {
    interface HTMLElementTagNameMap {
        'calendar-upcoming-card-editor': CalendarUpcomingCardEditor;
    }
}
//# sourceMappingURL=editor.d.ts.map