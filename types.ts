import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Language = 'pt' | 'en' | 'es';

export interface UserProfile {
  name: string;
  weight: number;
  dailyGoal: number;
  remindersEnabled: boolean;
  onboarded: boolean;
  language: Language;
}

export const TRANSLATIONS = {
  pt: {
    welcome: "Bem-vindo",
    hello: "Olá",
    today_consumption: "Consumo de hoje",
    goal: "Meta",
    drink_250: "Beber 250ml",
    goal_reached: "Meta Atingida!",
    congrats: "Parabéns por se manter hidratado hoje.",
    history: "Histórico",
    last_7_days: "Últimos 7 dias",
    settings: "Configurações",
    reminders: "Lembretes",
    reminders_desc: "Notificações de hora em hora",
    profile: "Perfil",
    weight: "Peso (kg)",
    weight_desc: "Sua meta diária é calculada automaticamente: 35ml por kg.",
    reset_app: "Resetar Aplicativo",
    reset_confirm: "Deseja realmente resetar todos os dados?",
    language: "Idioma",
    home: "Início",
    adjustments: "Ajustes",
    next: "Próximo",
    back: "Voltar",
    start: "Começar",
    how_call: "Como devemos te chamar?",
    your_name: "Seu nome",
    what_weight: "Qual seu peso atual? (kg)",
    weight_calc_desc: "Usamos seu peso para calcular sua meta diária ideal.",
    setup_profile: "Vamos configurar seu perfil de hidratação.",
    today: "Hoje",
  },
  en: {
    welcome: "Welcome",
    hello: "Hello",
    today_consumption: "Today's consumption",
    goal: "Goal",
    drink_250: "Drink 250ml",
    goal_reached: "Goal Reached!",
    congrats: "Congratulations on staying hydrated today.",
    history: "History",
    last_7_days: "Last 7 days",
    settings: "Settings",
    reminders: "Reminders",
    reminders_desc: "Hourly notifications",
    profile: "Profile",
    weight: "Weight (kg)",
    weight_desc: "Your daily goal is calculated automatically: 35ml per kg.",
    reset_app: "Reset App",
    reset_confirm: "Do you really want to reset all data?",
    language: "Language",
    home: "Home",
    adjustments: "Settings",
    next: "Next",
    back: "Back",
    start: "Start",
    how_call: "What should we call you?",
    your_name: "Your name",
    what_weight: "What is your current weight? (kg)",
    weight_calc_desc: "We use your weight to calculate your ideal daily goal.",
    setup_profile: "Let's set up your hydration profile.",
    today: "Today",
  },
  es: {
    welcome: "Bienvenido",
    hello: "Hola",
    today_consumption: "Consumo de hoy",
    goal: "Meta",
    drink_250: "Beber 250ml",
    goal_reached: "¡Meta Alcanzada!",
    congrats: "Felicitaciones por mantenerte hidratado hoy.",
    history: "Historial",
    last_7_days: "Últimos 7 días",
    settings: "Ajustes",
    reminders: "Recordatorios",
    reminders_desc: "Notificaciones cada hora",
    profile: "Perfil",
    weight: "Peso (kg)",
    weight_desc: "Tu meta diaria se calcula automáticamente: 35ml por kg.",
    reset_app: "Reiniciar Aplicación",
    reset_confirm: "¿Realmente quieres reiniciar todos los datos?",
    language: "Idioma",
    home: "Inicio",
    adjustments: "Ajustes",
    next: "Siguiente",
    back: "Atrás",
    start: "Comenzar",
    how_call: "¿Cómo deberíamos llamarte?",
    your_name: "Tu nombre",
    what_weight: "¿Cuál es tu peso actual? (kg)",
    weight_calc_desc: "Usamos tu peso para calcular tu meta diaria ideal.",
    setup_profile: "Vamos a configurar tu perfil de hidratación.",
    today: "Hoy",
  }
};

export interface WaterEntry {
  id: string;
  amount: number;
  timestamp: number;
}

export interface DailyHistory {
  date: string; // YYYY-MM-DD
  total: number;
}

export const STORAGE_KEYS = {
  PROFILE: 'hidro_plus_profile',
  ENTRIES: 'hidro_plus_entries',
  HISTORY: 'hidro_plus_history',
  THEME: 'hidro_plus_theme',
};

export const MOTIVATIONAL_MESSAGES = [
  "Hora de se hidratar 💧",
  "Seu corpo precisa de água!",
  "Bora bater sua meta hoje!",
  "Água é vida! Beba um pouco agora.",
  "Sente sede? Já passou da hora de beber!",
  "Mantenha o foco e beba água.",
];
