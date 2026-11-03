// Invest Saudi design system — window.InvestSaudiDS
import * as React from "react";
/** Renders one of the 1,173 stroke icons from the file's Icons page, plus eight filled `social-*` marks. */
export interface IconProps { name: string; size?: number; title?: string; strokeWidth?: number; className?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;
/** The single button for every action: primary, secondary (gray / colour), tertiary, link and destructive hierarchies in five sizes. */
export interface ButtonProps { hierarchy?: 'primary'|'secondary-gray'|'secondary-color'|'tertiary-gray'|'tertiary-color'|'link-gray'|'link-color'|'destructive'|'secondary-destructive'; size?: 'sm'|'md'|'lg'|'xl'|'2xl'; iconLeading?: string; iconTrailing?: string; icon?: string; href?: string; disabled?: boolean; block?: boolean; ariaLabel?: string; onClick?: () => void; children?: React.ReactNode; className?: string }
export declare function Button(props: ButtonProps): React.ReactElement;
/** The X close control for modals, alerts, drawers and the cookies popup. */
export interface CloseButtonProps { size?: 'sm'|'md'|'lg'; onClick?: () => void; ariaLabel?: string; className?: string }
export declare function CloseButton(props: CloseButtonProps): React.ReactElement;
/** Text input field with label, required asterisk, hint or error text, optional leading icon and trailing button. */
export interface InputProps { label?: string; required?: boolean; placeholder?: string; hint?: string; error?: string|boolean; size?: 'sm'|'md'; iconLeading?: string; iconTrailing?: string; trailingButton?: string; onTrailingClick?: () => void; type?: string; inputDir?: 'ltr'|'rtl'; value?: string; defaultValue?: string; onChange?: (e: any) => void; disabled?: boolean; className?: string }
export declare function Input(props: InputProps): React.ReactElement;
/** Multi-line text field sharing the Input label, hint and error rules. */
export interface TextareaProps { label?: string; required?: boolean; placeholder?: string; hint?: string; error?: string; rows?: number; disabled?: boolean; className?: string }
export declare function Textarea(props: TextareaProps): React.ReactElement;
/** Dropdown select field (Input dropdown in the file) with label, hint and chevron. */
export interface SelectProps { label?: string; options: (string|{value:string;label:string})[]; placeholder?: string; iconLeading?: string; size?: 'sm'|'md'; value?: string; defaultValue?: string; onChange?: (e:any)=>void; disabled?: boolean; className?: string }
export declare function Select(props: SelectProps): React.ReactElement;
/** Checkbox with optional title and supporting text. */
export interface CheckboxProps { label?: string; description?: string; checked?: boolean; defaultChecked?: boolean; indeterminate?: boolean; size?: 'sm'|'md'; disabled?: boolean; onChange?: (e:any)=>void; className?: string }
export declare function Checkbox(props: CheckboxProps): React.ReactElement;
/** Radio button with optional title and supporting text; group by giving the same `name`. */
export interface RadioProps { name?: string; value?: string; label?: string; description?: string; checked?: boolean; defaultChecked?: boolean; size?: 'sm'|'md'; disabled?: boolean; className?: string }
export declare function Radio(props: RadioProps): React.ReactElement;
/** On/off toggle (56×24 slim track) with optional label and supporting text. */
export interface SwitchProps { label?: string; description?: string; checked?: boolean; defaultChecked?: boolean; disabled?: boolean; onChange?: (e:any)=>void; className?: string }
export declare function Switch(props: SwitchProps): React.ReactElement;
/** Tag / badge for status, sector names and counts — pill, badge, modern and sector styles. */
export interface TagProps { color?: 'brand'|'gray'|'success'|'warning'|'error'|'blue'|'blue-light'|'blue-dark'|'indigo'|'purple'|'pink'|'orange'|'gray-blue'; type?: 'pill'|'badge'|'modern'|'sector'; size?: 'sm'|'md'|'lg'; dot?: boolean; icon?: string; onRemove?: () => void; children?: React.ReactNode; className?: string }
export declare function Tag(props: TagProps): React.ReactElement;
/** Inline floating alert with featured icon, title, text, actions and close. */
export interface AlertProps { color?: 'brand'|'gray'|'info'|'success'|'warning'|'error'; title?: string; icon?: string; actions?: React.ReactNode; onClose?: () => void; children?: React.ReactNode; className?: string }
export declare function Alert(props: AlertProps): React.ReactElement;
/** Circular icon badge used by alerts, modals and empty states. */
export interface FeaturedIconProps { icon?: string; color?: 'brand'|'gray'|'success'|'warning'|'error'; size?: 'sm'|'md'|'lg'|'xl'; type?: 'light'|'modern'; className?: string }
export declare function FeaturedIcon(props: FeaturedIconProps): React.ReactElement;
/** Horizontal tabs in underline, button-border and button-gray styles. */
export interface TabsProps { items: {label: string; value?: string; badge?: React.ReactNode}[]; type?: 'underline'|'button-border'|'button-gray'|'vertical'; value?: string; defaultValue?: string; onChange?: (v: string) => void; className?: string }
export declare function Tabs(props: TabsProps): React.ReactElement;
/** Breadcrumb trail starting from a home icon, chevron-separated. */
export interface BreadcrumbsProps { items: {label: string; href?: string}[]; home?: boolean; homeHref?: string; className?: string }
export declare function Breadcrumbs(props: BreadcrumbsProps): React.ReactElement;
/** Numbered pagination with previous/next links and ellipsis. */
export interface PaginationProps { total: number; page?: number; defaultPage?: number; onChange?: (n: number) => void; prevLabel?: string; nextLabel?: string; className?: string }
export declare function Pagination(props: PaginationProps): React.ReactElement;
/** Dark tooltip bubble with optional supporting text and arrow. */
export interface TooltipProps { title: string; description?: string; arrow?: 'bottom'|'top'|'none'; className?: string }
export declare function Tooltip(props: TooltipProps): React.ReactElement;
/** Circular avatar with image, initials or placeholder, optional online dot and label group. */
export interface AvatarProps { size?: 'xs'|'sm'|'md'|'lg'|'xl'|'2xl'; src?: string; alt?: string; initials?: string; online?: boolean; label?: string; supporting?: string; className?: string }
export declare function Avatar(props: AvatarProps): React.ReactElement;
/** Linear progress bar with percentage label. */
export interface ProgressBarProps { value: number; label?: boolean; className?: string }
export declare function ProgressBar(props: ProgressBarProps): React.ReactElement;
/** Circular spinner with optional label. */
export interface LoadingProps { size?: 'sm'|'md'|'lg'|'xl'; label?: string|false; className?: string }
export declare function Loading(props: LoadingProps): React.ReactElement;
/** Dialog with overlay, featured icon, title, description, content and an action row. */
export interface ModalProps { title: string; description?: string; icon?: string|false; color?: string; layout?: 'horizontal'|'stacked'; actions?: React.ReactNode; onClose?: () => void; open?: boolean; inline?: boolean; width?: number; children?: React.ReactNode; className?: string }
export declare function Modal(props: ModalProps): React.ReactElement;
/** Section title with supporting text, actions and divider. */
export interface SectionHeaderProps { title: string; supporting?: string; actions?: React.ReactNode; tabs?: React.ReactNode; divider?: boolean; className?: string }
export declare function SectionHeader(props: SectionHeaderProps): React.ReactElement;
/** Horizontal divider with optional centred text or heading. */
export interface ContentDividerProps { heading?: boolean; children?: React.ReactNode; className?: string }
export declare function ContentDivider(props: ContentDividerProps): React.ReactElement;
/** KPI card: label, large number and trend badge. */
export interface MetricItemProps { label: string; value: string; change?: string; trend?: 'up'|'down'; className?: string }
export declare function MetricItem(props: MetricItemProps): React.ReactElement;
/** Empty state with icon disc, title, description and actions. */
export interface EmptyStateProps { icon?: string; title: string; description?: string; actions?: React.ReactNode; className?: string }
export declare function EmptyState(props: EmptyStateProps): React.ReactElement;
/** Data table card with title, badge, actions, header row and divider or striped rows. */
export interface TableProps { title?: string; badge?: string; actions?: React.ReactNode; columns: {key: string; title: string; width?: number|string; render?: (row: any) => React.ReactNode}[]; rows: any[]; striped?: boolean; footer?: React.ReactNode; className?: string }
export declare function Table(props: TableProps): React.ReactElement;
/** The unified Saudi government digital stamp bar () with its expandable “how to verify” panel. */
export interface DigitalStampProps { defaultOpen?: boolean; text?: string; linkText?: string; registration?: string; className?: string }
export declare function DigitalStamp(props: DigitalStampProps): React.ReactElement;
/** Second-level bar under the stamp: date, time, city and accessibility tools (voice, zoom out/in, contrast). */
export interface SubHeaderProps { date?: string; time?: string; city?: string; className?: string }
export declare function SubHeader(props: SubHeaderProps): React.ReactElement;
/** The Invest Saudi site header: digital stamp, floating rounded nav bar with Invest Saudi + Vision 2030 logos, main menu, search, language and sign-in actions. */
export interface HeaderProps { links?: (string|{label: string; href?: string; menu?: boolean})[]; signedIn?: boolean; initials?: string; loginLabel?: string; signupLabel?: string; langLabel?: string; stamp?: boolean; homeHref?: string; className?: string }
export declare function Header(props: HeaderProps): React.ReactElement;
/** The Invest Saudi site footer: link columns, newsletter signup, social links, copyright and MISA / Invest Saudi logos. */
export interface FooterProps { columns?: {title: string; links: string[]}[]; copyright?: string; className?: string }
export declare function Footer(props: FooterProps): React.ReactElement;
/** Investment opportunity card (Level 1): image with sector badge and presentation button, title, region / investment size, and a full-width primary CTA. */
export interface OpportunityCardProps { title?: string; sector?: string; sectorColor?: string; image?: string; region?: string; size?: string; metaLabel1?: string; metaLabel2?: string; cta?: string; onView?: () => void; className?: string }
export declare function OpportunityCard(props: OpportunityCardProps): React.ReactElement;
/** “Was this page helpful?” band shown above the footer on content pages. */
export interface FeedbackBannerProps { question?: string; stat?: string; thanks?: string; className?: string }
export declare function FeedbackBanner(props: FeedbackBannerProps): React.ReactElement;
/** Bottom cookies consent panel with cookie categories (switches) and accept / decline. */
export interface CookiesPopupProps { title?: string; text?: string; types?: {t: string; d?: string; on?: boolean}[]; onAccept?: () => void; onDecline?: () => void; onClose?: () => void; className?: string }
export declare function CookiesPopup(props: CookiesPopupProps): React.ReactElement;
/** Compact filter / selection chip with optional checkbox, icon, count and remove control. */
export interface ChipProps { size?: "sm"|"md"|"lg"; selected?: boolean; checkbox?: boolean; icon?: string; count?: number; rounded?: boolean; onClick?: () => void; onRemove?: () => void; disabled?: boolean; children?: React.ReactNode; className?: string }
export declare function Chip(props: ChipProps): React.ReactElement;
/** Content switcher: a joined row of toggle buttons for switching views or filters. */
export interface ButtonGroupProps { items: {label?: string; icon?: string; value?: string; ariaLabel?: string}[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; className?: string }
export declare function ButtonGroup(props: ButtonGroupProps): React.ReactElement;
/** Single- or multi-line code block with line numbers and a copy button. */
export interface CodeSnippetProps { code: string; className?: string }
export declare function CodeSnippet(props: CodeSnippetProps): React.ReactElement;
/** Month calendar with navigation, today marker, single-date selection and range highlight. */
export interface CalendarProps { month?: Date; today?: Date; defaultValue?: Date; range?: [Date, Date]; onChange?: (d: Date) => void; actions?: React.ReactNode; className?: string }
export declare function Calendar(props: CalendarProps): React.ReactElement;
/** Date picker: a secondary button showing the chosen date that opens a Calendar with cancel / apply. */
export interface DatePickerProps { label?: string; placeholder?: string; defaultValue?: Date; defaultOpen?: boolean; onChange?: (d: Date|null) => void; className?: string }
export declare function DatePicker(props: DatePickerProps): React.ReactElement;
/** Toast notification with featured icon or avatar, title, text, optional progress and actions. */
export interface NotificationProps { title: string; color?: string; icon?: string; avatar?: string; progress?: number; actions?: React.ReactNode; onClose?: () => void; children?: React.ReactNode; className?: string }
export declare function Notification(props: NotificationProps): React.ReactElement;
/** Dropdown menu (account, actions, language) opened from a button or custom trigger. */
export interface DropdownMenuProps { label?: string; trigger?: React.ReactNode; items: any[]; header?: React.ReactNode; align?: "start"|"end"; defaultOpen?: boolean; className?: string }
export declare function DropdownMenu(props: DropdownMenuProps): React.ReactElement;
/** File upload dropzone with a queue of uploaded / uploading files. */
export interface FileUploadProps { files?: {name: string; size: string; type?: string; progress?: number}[]; accept?: string; multiple?: boolean; onChange?: (e: any) => void; hint?: string; ctaText?: string; dragText?: string; className?: string }
export declare function FileUpload(props: FileUploadProps): React.ReactElement;
/** Filtration: a filter trigger with active-filter chips and a collapsible panel of checkbox groups with clear / apply. */
export interface FilterPanelProps { groups: {title: string; options: string[]}[]; active?: string[]; onRemove?: (v: string) => void; label?: string; defaultOpen?: boolean; className?: string }
export declare function FilterPanel(props: FilterPanelProps): React.ReactElement;
/** Horizontal progress steps (icons centred with text) for multi-step forms such as licence applications. */
export interface ProgressStepsProps { steps: (string|{title: string; description?: string})[]; current?: number; className?: string }
export declare function ProgressSteps(props: ProgressStepsProps): React.ReactElement;
/** Circular stepper showing “n / total” inside a brand progress ring. */
export interface CircularStepperProps { current: number; total: number; size?: number; className?: string }
export declare function CircularStepper(props: CircularStepperProps): React.ReactElement;
/** Range slider with label and value readout. */
export interface SliderProps { label?: string; min?: number; max?: number; step?: number; value?: number; defaultValue?: number; onChange?: (v: number) => void; format?: (v: number) => string; showValue?: boolean; className?: string }
export declare function Slider(props: SliderProps): React.ReactElement;
/** Search command bar: a large search input with grouped, filterable results and keyboard hints. */
export interface CommandBarProps { groups: {title: string; items: {label: string; icon?: string; meta?: string}[]}[]; placeholder?: string; autoFocus?: boolean; className?: string }
export declare function CommandBar(props: CommandBarProps): React.ReactElement;
/** Slide-out side panel (drawer) with title, scrollable body and an action footer. */
export interface SlideoutMenuProps { title: string; description?: string; actions?: React.ReactNode; onClose?: () => void; open?: boolean; width?: number; inline?: boolean; children?: React.ReactNode; className?: string }
export declare function SlideoutMenu(props: SlideoutMenuProps): React.ReactElement;
/** One-time-code input with 4 or 6 large digit boxes. */
export interface VerificationCodeInputProps { digits?: 4|6; size?: "sm"|"md"|"lg"; label?: string; hint?: string; className?: string }
export declare function VerificationCodeInput(props: VerificationCodeInputProps): React.ReactElement;
/** Application sidebar navigation (dual-tier or slim) for the investor portal. */
export interface SidebarNavProps { items: {label: string; icon?: string; badge?: React.ReactNode}[]; defaultValue?: string; onChange?: (v: string) => void; slim?: boolean; search?: boolean; footer?: React.ReactNode; className?: string }
export declare function SidebarNav(props: SidebarNavProps): React.ReactElement;
/** Header mega-menu dropdown: featured guide card plus columns of menu items, as in the Investor Services menu. */
export interface MegaMenuProps { content?: any; className?: string }
export declare function MegaMenu(props: MegaMenuProps): React.ReactElement;
/** Carousel pagination dots or line indicators. */
export interface PaginationDotsProps { count: number; current?: number; onChange?: (i: number) => void; style?: "dot"|"line"; framed?: boolean; className?: string }
export declare function PaginationDots(props: PaginationDotsProps): React.ReactElement;
/** Image carousel with caption, previous / next arrows and framed dots. */
export interface CarouselProps { slides: {image?: string; caption?: string}[]; height?: number; className?: string }
export declare function Carousel(props: CarouselProps): React.ReactElement;
/** Rotating headline stats (the sign-in gallery): eyebrow, large statement and line indicators. */
export interface StatsGalleryProps { items?: {eyebrow: string; text: string}[]; className?: string }
export declare function StatsGallery(props: StatsGalleryProps): React.ReactElement;
/** Selectable option card (checkbox-group / radio-group card) with icon, title, meta and description. */
export interface CheckboxCardProps { title: string; meta?: string; description?: string; icon?: string; type?: "checkbox"|"radio"; name?: string; checked?: boolean; defaultChecked?: boolean; onChange?: (e: any) => void; className?: string }
export declare function CheckboxCard(props: CheckboxCardProps): React.ReactElement;
/** Animated rolling number (Numpar) for headline metrics. */
export interface NumberTickerProps { value: string; prefix?: string; suffix?: string; className?: string }
export declare function NumberTicker(props: NumberTickerProps): React.ReactElement;
/** FAQ accordion with plus / minus icons. */
export interface FAQProps { items: {q: string; a: string}[]; firstOpen?: boolean; className?: string }
export declare function FAQ(props: FAQProps): React.ReactElement;
/** Inline call-to-action card with title, text, optional image and buttons. */
export interface InlineCTAProps { title: string; text?: string; image?: string; actions?: React.ReactNode; className?: string }
export declare function InlineCTA(props: InlineCTAProps): React.ReactElement;
/** Section / card footer row with a leading element and trailing actions over a top divider. */
export interface SectionFooterProps { actions?: React.ReactNode; card?: boolean; children?: React.ReactNode; className?: string }
export declare function SectionFooter(props: SectionFooterProps): React.ReactElement;
/** Activity feed of avatar + name + time + text items, with optional attachments, unread dots and connector line. */
export interface ActivityFeedProps { items: any[]; connector?: boolean; className?: string }
export declare function ActivityFeed(props: ActivityFeedProps): React.ReactElement;
/** Chat message bubble — received, sent, writing indicator and reaction. */
export interface MessageProps { sent?: boolean; name?: string; initials?: string; time?: string; online?: boolean; writing?: boolean; reaction?: string; children?: React.ReactNode; className?: string }
export declare function Message(props: MessageProps): React.ReactElement;
/** Sign-in button for Nafath (*/
export interface SocialButtonProps { provider?: "nafath"|"google"|"apple"|"facebook"; block?: boolean; iconOnly?: boolean; onClick?: () => void; children?: React.ReactNode; className?: string }
export declare function SocialButton(props: SocialButtonProps): React.ReactElement;
/** Official mobile app-store badge (App Store, Google Play, Galaxy Store, AppGallery). */
export interface AppStoreBadgeProps { store?: "appStore"|"googlePlay"|"galaxyStore"|"appGallery"; href?: string; size?: "md"|"lg"; className?: string }
export declare function AppStoreBadge(props: AppStoreBadgeProps): React.ReactElement;
/** Question-mark help icon that shows a Tooltip on hover or focus. */
export interface HelpIconProps { title: string; description?: string; defaultOpen?: boolean; className?: string }
export declare function HelpIcon(props: HelpIconProps): React.ReactElement;
/** Overlapping avatar stack with “+n” overflow and optional add button. */
export interface AvatarGroupProps { people: any[]; max?: number; size?: string; onAdd?: () => void; className?: string }
export declare function AvatarGroup(props: AvatarGroupProps): React.ReactElement;
/** Tertiary icon button that opens a QR-code card for an opportunity. */
export interface QRCodeButtonProps { title?: string; text?: string; image?: string; defaultOpen?: boolean; className?: string }
export declare function QRCodeButton(props: QRCodeButtonProps): React.ReactElement;
/** Opportunity card Level 2: the detail panel opened from an OpportunityCard (image, title, status/sector tags, location, about, key-figures grid, and CTA with QR / share / save). */
export interface OpportunityDetailsProps { title?: string; image?: string; tags?: [string, string][]; location?: string; about?: string; stats?: {label: string; value: string; unit?: string; good?: boolean}[]; cta?: string; heading?: string; onClose?: () => void; className?: string }
export declare function OpportunityDetails(props: OpportunityDetailsProps): React.ReactElement;
/** Line or bar chart with grid, axis labels and legend, coloured by the utility chart palette. */
export interface LineChartProps { series: {name: string; data: number[]; color?: string}[]; labels: string[]; type?: "line"|"bar"; title?: string; width?: number; height?: number; className?: string }
export declare function LineChart(props: LineChartProps): React.ReactElement;
/** Donut / pie chart with a percentage legend. */
export interface PieChartProps { data: {label: string; value: number; color?: string}[]; size?: number; donut?: boolean; className?: string }
export declare function PieChart(props: PieChartProps): React.ReactElement;
/** Circular or half-circle progress gauge with label and percentage. */
export interface ProgressCircleProps { value: number; label?: string; size?: "xs"|"sm"|"md"|"lg"; shape?: "circle"|"half"; className?: string }
export declare function ProgressCircle(props: ProgressCircleProps): React.ReactElement;
/** Concentric activity rings with legend. */
export interface ActivityGaugeProps { rings?: {label: string; value: number}[]; size?: number; className?: string }
export declare function ActivityGauge(props: ActivityGaugeProps): React.ReactElement;
/** Page header: optional banner image, breadcrumbs, page title, supporting text, actions and divider. */
export interface PageHeaderProps { title: string; supporting?: string; breadcrumbs?: {label: string; href?: string}[]; actions?: React.ReactNode; banner?: string|null; divider?: boolean; className?: string }
export declare function PageHeader(props: PageHeaderProps): React.ReactElement;
/** Card header: optional avatar, title with badge, supporting text and actions, over a bottom rule. */
export interface CardHeaderProps { title: string; badge?: string; supporting?: string; avatar?: string; actions?: React.ReactNode; className?: string }
export declare function CardHeader(props: CardHeaderProps): React.ReactElement;
/** Small section label for settings / form sections: title, supporting text, optional action and divider. */
export interface SectionLabelProps { title: string; supporting?: string; actions?: React.ReactNode; size?: "sm"|"md"; className?: string }
export declare function SectionLabel(props: SectionLabelProps): React.ReactElement;
