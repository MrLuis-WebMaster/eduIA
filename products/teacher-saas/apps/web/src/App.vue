<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Activity, ArrowRight, ArrowUpRight, BookOpen, Bot, CalendarDays, Check, ChevronDown,
  Clock3, Cloud, Compass, FileText, FolderOpen, GraduationCap, LayoutDashboard,
  MapPin, Menu, MessageCircleQuestion, Plus, Search, Settings2, ShieldCheck,
  Sparkles, Store, UsersRound, Video, X
} from 'lucide-vue-next';

type Page = 'overview' | 'schedule' | 'students' | 'learning' | 'integrations' | 'studio';
type Mode = 'ONLINE' | 'ONSITE' | 'HYBRID';
type WorkspaceType = 'SOLO' | 'ACADEMY';
type Provider = 'MEET' | 'ZOOM' | 'CUSTOM';
interface Session { id: number; title: string; subject: string; student: string; day: string; time: string; mode: Mode; provider: Provider | null; location: string; }
const pages = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'schedule', label: 'Agenda y clases', icon: CalendarDays },
  { id: 'students', label: 'Alumnos', icon: UsersRound },
  { id: 'learning', label: 'Aprendizaje', icon: GraduationCap },
  { id: 'integrations', label: 'Integraciones', icon: Cloud },
  { id: 'studio', label: 'Profe Studio', icon: Store },
] as const;
const currentPage = ref<Page>('overview');
const workspaceType = ref<WorkspaceType>('SOLO');
const mobileMenu = ref(false);
const showCreate = ref(false);
const formError = ref('');
const subjects = ['Matemáticas', 'Inglés', 'Programación', 'Física'];
const filter = ref('Todas');
const sessions = ref<Session[]>([
  { id: 1, title: 'Ecuaciones de primer grado', subject: 'Matemáticas', student: 'Santiago López', day: '2026-11-24', time: '09:00', mode: 'ONLINE', provider: 'MEET', location: '' },
  { id: 2, title: 'Conversación nivel B1', subject: 'Inglés', student: 'Grupo B1 · 5 alumnos', day: '2026-11-24', time: '11:00', mode: 'HYBRID', provider: 'ZOOM', location: 'Sede Centro · Aula 2' },
  { id: 3, title: 'Fundamentos de JavaScript', subject: 'Programación', student: 'Valentina Ruiz', day: '2026-11-25', time: '15:30', mode: 'ONSITE', provider: null, location: 'Biblioteca Central' },
]);
const students = [
  { initials: 'SL', name: 'Santiago López', subject: 'Matemáticas', score: 68, color: 'blue' },
  { initials: 'VR', name: 'Valentina Ruiz', subject: 'Programación', score: 84, color: 'purple' },
  { initials: 'AM', name: 'Andrés Moreno', subject: 'Inglés', score: 46, color: 'peach' },
  { initials: 'SP', name: 'Sofía Pérez', subject: 'Física', score: 91, color: 'green' },
];
const connections = [
  { name: 'Google Meet', category: 'Videollamadas', symbol: 'M', color: 'mint', desc: 'Crea enlaces mediante Google Calendar' },
  { name: 'Zoom', category: 'Videollamadas', symbol: 'Z', color: 'blue', desc: 'Reuniones virtuales desde tu cuenta' },
  { name: 'Google Drive', category: 'Archivos', symbol: 'D', color: 'green', desc: 'Selecciona y comparte materiales' },
  { name: 'OneDrive', category: 'Archivos', symbol: 'O', color: 'blue', desc: 'Próxima etapa' },
  { name: 'Dropbox', category: 'Archivos', symbol: 'D', color: 'sky', desc: 'Próxima etapa' },
  { name: 'Google Calendar', category: 'Calendario', symbol: '31', color: 'peach', desc: 'Sincronización de disponibilidad' },
];
const learning = [
  { name: 'Clase Viva', icon: Sparkles, caption: 'Transforma cada clase en práctica personalizada.', label: 'Genera borradores de ejercicios, resúmenes y recordatorios a partir de observaciones del docente.' },
  { name: 'Pasaporte', icon: Compass, caption: 'Cada alumno tiene un camino de aprendizaje.', label: 'Objetivos, habilidades, evidencias de progreso y próximos pasos por materia.' },
  { name: 'Profe SOS', icon: MessageCircleQuestion, caption: 'Resuelve dudas sin reemplazar al profesor.', label: 'Un asistente especializado por curso da pistas y escala preguntas al docente.' },
];
const selectedLearning = ref(0);
const newTitle = ref('');
const newSubject = ref('Matemáticas');
const newStudent = ref('Santiago López');
const newDay = ref('2026-11-26');
const newTime = ref('10:00');
const newMode = ref<Mode>('ONLINE');
const newProvider = ref<Provider>('MEET');
const newLocation = ref('');
const brandName = ref('Academia de Laura');
const brandColor = ref('#6855ed');
const savedBrand = ref(false);
const search = ref('');
const visibleSessions = computed(() => sessions.value.filter(s =>
  (filter.value === 'Todas' || s.subject === filter.value) &&
  (s.title + s.student + s.subject).toLowerCase().includes(search.value.toLowerCase())
));
const pageTitle = computed(() => pages.find(p => p.id === currentPage.value)?.label || 'Resumen');
const workspaceName = computed(() => workspaceType.value === 'SOLO' ? 'Academia de Laura' : 'Academia Horizonte');
function navigate(page: Page) { currentPage.value = page; mobileMenu.value = false; }
function modeLabel(mode: Mode) { return mode === 'ONLINE' ? 'Virtual' : mode === 'ONSITE' ? 'Presencial' : 'Híbrida'; }
function openCreate() { formError.value = ''; showCreate.value = true; }
function createSession() {
  if (!newTitle.value.trim() || !newDay.value || !newTime.value) {
    formError.value = 'Completa el nombre, la fecha y la hora de la sesión.';
    return;
  }
  if (newMode.value !== 'ONLINE' && newLocation.value.trim().length < 5) {
    formError.value = 'Ingresa una ubicación válida para la sesión.';
    return;
  }
  sessions.value.unshift({
    id: Date.now(), title: newTitle.value.trim(), subject: newSubject.value,
    student: newStudent.value, day: newDay.value, time: newTime.value,
    mode: newMode.value, provider: newMode.value === 'ONSITE' ? null : newProvider.value,
    location: newMode.value === 'ONLINE' ? '' : newLocation.value.trim()
  });
  showCreate.value = false;
  currentPage.value = 'schedule';
  filter.value = 'Todas';
  search.value = '';
  newTitle.value = '';
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ visible: mobileMenu }">
      <div class="brand"><span class="brand-mark"><BookOpen :size="21" stroke-width="2.5"/></span><span>academia<span class="brand-dot">.</span><b>os</b></span><button class="menu-close" aria-label="Cerrar menú" @click="mobileMenu = false"><X :size="20"/></button></div>
      <div class="workspace-switch">
        <div class="workspace-avatar"><GraduationCap :size="20"/></div>
        <div class="workspace-info"><b>{{ workspaceName }}</b><small>{{ workspaceType === 'SOLO' ? 'Cuenta de profesor' : 'Espacio de academia' }}</small></div>
        <ChevronDown :size="15"/>
      </div>
      <p class="nav-caption">ESPACIO DE TRABAJO</p>
      <nav class="navigation" aria-label="Navegación principal">
        <button v-for="page in pages" :key="page.id" class="nav-link" :class="{ active: currentPage === page.id }" @click="navigate(page.id)">
          <component :is="page.icon" :size="18"/><span>{{ page.label }}</span>
          <span v-if="page.id === 'learning'" class="nav-dot"></span>
        </button>
      </nav>
      <div class="sidebar-bottom">
        <div class="upgrade-card"><span class="upgrade-icon"><Sparkles :size="18"/></span><b>Enseña a tu manera</b><p>Tu academia, tu identidad. Una experiencia única para cada alumno.</p><button @click="navigate('studio')">Personalizar academia <ArrowUpRight :size="14"/></button></div>
        <div class="account-row"><div class="user-avatar">L</div><div><b>Laura Martínez</b><small>Administradora · Demo</small></div><Settings2 :size="17"/></div>
      </div>
    </aside>
    <div v-if="mobileMenu" class="mobile-overlay" @click="mobileMenu = false"></div>

    <main class="content">
      <header class="topbar">
        <button class="mobile-toggle" aria-label="Abrir menú" @click="mobileMenu = true"><Menu :size="23"/></button>
        <div class="breadcrumb"><span>Mi espacio</span><span class="sep">/</span><strong>{{ pageTitle }}</strong></div>
        <div class="top-actions"><span class="demo-pill"><span class="live-dot"></span> Prototipo interactivo</span><button class="top-avatar" title="Cuenta demo">LM</button></div>
      </header>
      <div class="page-content">
        <div class="page-heading">
          <div><div class="eyebrow"><span class="tiny-sparkle">✦</span> TU ESPACIO EDUCATIVO</div><h1>{{ currentPage === 'overview' ? '¡Hola, Laura! 👋' : pageTitle }}</h1><p>{{ currentPage === 'overview' ? 'Todo lo que necesitas para enseñar, organizarte y crecer.' : 'Gestiona tu experiencia educativa desde un solo lugar.' }}</p></div>
          <button class="primary-button" @click="openCreate"><Plus :size="18"/> Nueva clase</button>
        </div>

        <template v-if="currentPage === 'overview'">
          <section class="hero"><div class="hero-copy"><span class="hero-overline">✦ UN NUEVO CAMINO PARA ENSEÑAR</span><h2>Tu conocimiento merece<br>un espacio extraordinario.</h2><p>Gestiona tus clases, acompaña a tus alumnos y haz que el aprendizaje continúe incluso después de cada sesión.</p><button @click="navigate('learning')">Descubre Clase Viva <ArrowRight :size="16"/></button></div><div class="hero-illustration"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="hero-object"><GraduationCap :size="63" stroke-width="1.4"/></span><div class="floating-chip chip-one"><Sparkles :size="15"/> Aprendizaje vivo</div><div class="floating-chip chip-two"><Check :size="14"/> +3 logros</div></div></section>
          <section class="stats-grid">
            <div class="stat-card"><div class="stat-heading"><span>Alumnos activos</span><span class="stat-icon blue"><UsersRound :size="18"/></span></div><b>24</b><small><span class="green-text">↗ +12%</span> respecto al mes anterior</small></div>
            <div class="stat-card"><div class="stat-heading"><span>Clases programadas</span><span class="stat-icon purple"><CalendarDays :size="18"/></span></div><b>{{ sessions.length }}</b><small>Sesiones próximas en la agenda</small></div>
            <div class="stat-card"><div class="stat-heading"><span>Progreso promedio</span><span class="stat-icon green"><Activity :size="18"/></span></div><b>76%</b><small><span class="green-text">↗ +8%</span> en aprendizaje</small></div>
            <div class="stat-card"><div class="stat-heading"><span>Materias disponibles</span><span class="stat-icon peach"><BookOpen :size="18"/></span></div><b>{{ subjects.length }}</b><small>Todo en un mismo espacio</small></div>
          </section>
          <section class="two-column">
            <div class="panel"><div class="panel-header"><div><h3>Próximas clases</h3><p>Tu agenda para los próximos días</p></div><button class="text-link" @click="navigate('schedule')">Ver agenda <ArrowRight :size="15"/></button></div><div class="lesson-list"><div v-for="item in sessions.slice(0, 3)" :key="item.id" class="lesson-row"><div class="time-box"><b>{{ item.time }}</b><small>{{ item.day.slice(5) }}</small></div><div class="lesson-info"><b>{{ item.title }}</b><small>{{ item.student }} · {{ item.subject }}</small></div><span class="mode-badge" :class="item.mode.toLowerCase()">{{ modeLabel(item.mode) }}</span></div></div></div>
            <div class="panel"><div class="panel-header"><div><h3>Una enseñanza que evoluciona</h3><p>Experiencias que marcan la diferencia</p></div></div><div class="feature-list"><button v-for="item in learning" :key="item.name" @click="selectedLearning = learning.indexOf(item); navigate('learning')" class="feature-item"><span class="feature-icon"><component :is="item.icon" :size="21"/></span><span><b>{{ item.name }}</b><small>{{ item.caption }}</small></span><ArrowUpRight :size="16"/></button></div></div>
          </section>
          <p class="demo-note"><ShieldCheck :size="15"/> Los valores son datos de demostración. Todavía no existen alumnos ni reservas reales.</p>
        </template>

        <template v-if="currentPage === 'schedule'">
          <section class="panel wide-panel"><div class="panel-header"><div><h3>Agenda de clases</h3><p>Presenciales, virtuales e híbridas en un mismo lugar</p></div><span class="small-counter">{{ visibleSessions.length }} sesiones</span></div><div class="toolbar"><label class="search-field"><Search :size="17"/><input v-model="search" placeholder="Buscar clase, alumno o materia..." /></label><select v-model="filter" aria-label="Filtrar materia"><option>Todas</option><option v-for="subject in subjects" :key="subject">{{ subject }}</option></select></div><div class="schedule-list"><div v-for="item in visibleSessions" :key="item.id" class="session-card"><div class="date-tile"><b>{{ item.day.slice(8) }}</b><small>{{ item.day.slice(5,7) }}/2026</small></div><div class="session-details"><h4>{{ item.title }}</h4><p>{{ item.subject }} · {{ item.student }}</p><span class="session-meta"><Clock3 :size="14"/> {{ item.time }} <span class="dot-separator">·</span> <component :is="item.mode === 'ONSITE' ? MapPin : Video" :size="14"/> {{ item.mode === 'ONSITE' ? item.location : item.provider === 'MEET' ? 'Google Meet (demo)' : item.provider === 'ZOOM' ? 'Zoom (demo)' : 'Enlace manual' }}</span><span v-if="item.mode === 'HYBRID'" class="hybrid-note"><MapPin :size="13"/> {{ item.location }}</span></div><span class="mode-badge" :class="item.mode.toLowerCase()">{{ modeLabel(item.mode) }}</span></div><div v-if="visibleSessions.length === 0" class="empty-state">No encontramos clases con estos filtros.</div></div></section>
        </template>

        <template v-if="currentPage === 'students'">
          <section class="panel wide-panel"><div class="panel-header"><div><h3>Mis alumnos</h3><p>Seguimiento personalizado en cada materia</p></div><span class="small-counter">4 ejemplos</span></div><div class="students-table"><div v-for="student in students" :key="student.name" class="student-row"><div class="student-id"><div class="student-avatar" :class="student.color">{{ student.initials }}</div><div><b>{{ student.name }}</b><small>{{ student.subject }}</small></div></div><div class="progress-block"><div class="progress-head"><span>Pasaporte</span><b>{{ student.score }}%</b></div><div class="progress-track"><span :style="{ width: student.score + '%' }"></span></div></div><span class="student-active">Activo</span></div></div></section>
        </template>

        <template v-if="currentPage === 'learning'">
          <div class="learning-grid"><button v-for="(item,index) in learning" :key="item.name" class="learning-card" :class="{ chosen: selectedLearning === index }" @click="selectedLearning = index"><span class="learning-icon"><component :is="item.icon" :size="24"/></span><h3>{{ item.name }}</h3><p>{{ item.caption }}</p><span class="learning-action">Explorar <ArrowRight :size="15"/></span></button></div>
          <section class="panel learning-preview"><div class="preview-label"><Sparkles :size="16"/> EXPERIENCIA EDUCATIVA</div><h2>{{ learning[selectedLearning].name }}</h2><p>{{ learning[selectedLearning].label }}</p><div class="sample-process"><div class="sample-step"><span>01</span> Profesor prepara o imparte una clase</div><div class="sample-step"><span>02</span> Se recopila contexto pedagógico autorizado</div><div class="sample-step"><span>03</span> Se proponen actividades o recomendaciones</div><div class="sample-step"><span>04</span> Docente revisa y alumnos participan</div></div><p class="demo-note">Estas experiencias están diseñadas, todavía no usan un servicio de IA real.</p></section>
        </template>

        <template v-if="currentPage === 'integrations'">
          <div class="integration-intro"><span class="feature-icon"><Cloud :size="26"/></span><div><h3>Tus herramientas, en un solo lugar</h3><p>Elige las aplicaciones que ya usas para enseñar. OAuth y sincronización son parte del roadmap.</p></div></div>
          <section class="connections-grid"><div v-for="item in connections" :key="item.name" class="connection-card"><span class="integration-logo" :class="item.color">{{ item.symbol }}</span><span class="integration-category">{{ item.category }}</span><h3>{{ item.name }}</h3><p>{{ item.desc }}</p><span class="connection-status">No conectado · próximamente</span><button disabled title="La conexión OAuth todavía no está implementada">Conectar <ArrowUpRight :size="14"/></button></div></section>
          <p class="demo-note"><ShieldCheck :size="15"/> No se solicita acceso a cuentas ni se almacenan credenciales en este prototipo.</p>
        </template>

        <template v-if="currentPage === 'studio'">
          <div class="studio-layout"><section class="panel studio-form"><div class="panel-header"><div><h3>Identidad de tu academia</h3><p>Haz que cada alumno reconozca tu marca.</p></div></div><label class="form-field">Nombre de tu academia<input v-model="brandName" maxlength="60" /></label><label class="form-field">Color principal<input v-model="brandColor" type="color" class="color-picker"/></label><div class="form-field"><span>Tipo de espacio</span><div class="option-switch"><button :class="{ selected: workspaceType === 'SOLO' }" @click="workspaceType = 'SOLO'">Profesor</button><button :class="{ selected: workspaceType === 'ACADEMY' }" @click="workspaceType = 'ACADEMY'">Academia</button></div></div><button class="primary-button" @click="savedBrand = true">Guardar vista previa <Check :size="17"/></button><p v-if="savedBrand" class="success-message">Cambios guardados en esta vista de demostración.</p></section><section class="studio-preview"><div class="mini-browser"><span></span><span></span><span></span><small>tuacademia.ejemplo.com</small></div><div class="public-preview"><div class="public-logo" :style="{ backgroundColor: brandColor }"><GraduationCap :size="23"/></div><small>BIENVENIDOS A</small><h2>{{ brandName || 'Tu academia' }}</h2><p>Aprender puede sentirse diferente. Clases hechas a tu medida, por profesores que te acompañan.</p><button :style="{ backgroundColor: brandColor }">Explorar mis clases <ArrowRight :size="15"/></button><div class="preview-tile"><FileText :size="18"/><span>Materias, cursos y experiencias a tu manera</span></div></div></section></div>
        </template>
      </div>
    </main>

    <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="new-session-title">
        <header class="modal-head"><div><span class="eyebrow">GESTIÓN DE CLASES</span><h2 id="new-session-title">Programar una clase</h2></div><button class="icon-button" aria-label="Cerrar" @click="showCreate = false"><X :size="20"/></button></header>
        <div class="modal-body"><label class="form-field">Título de la sesión<input v-model="newTitle" placeholder="Ej. Introducción a ecuaciones" /></label><div class="form-grid"><label class="form-field">Materia<select v-model="newSubject"><option v-for="s in subjects" :key="s">{{ s }}</option></select></label><label class="form-field">Alumno o grupo<select v-model="newStudent"><option v-for="s in students" :key="s.name">{{ s.name }}</option><option>Grupo B1 · 5 alumnos</option></select></label></div><div class="form-grid"><label class="form-field">Fecha<input v-model="newDay" type="date"/></label><label class="form-field">Hora<input v-model="newTime" type="time"/></label></div><div class="form-field"><span>Modalidad</span><div class="option-switch"><button :class="{ selected: newMode === 'ONLINE' }" @click="newMode = 'ONLINE'"><Video :size="15"/> Virtual</button><button :class="{ selected: newMode === 'ONSITE' }" @click="newMode = 'ONSITE'"><MapPin :size="15"/> Presencial</button><button :class="{ selected: newMode === 'HYBRID' }" @click="newMode = 'HYBRID'">Híbrida</button></div></div><label v-if="newMode !== 'ONSITE'" class="form-field">Proveedor de videollamada<select v-model="newProvider"><option value="MEET">Google Meet · conexión pendiente</option><option value="ZOOM">Zoom · conexión pendiente</option><option value="CUSTOM">Enlace manual · próximamente</option></select></label><label v-if="newMode !== 'ONLINE'" class="form-field">Ubicación<input v-model="newLocation" placeholder="Sede o dirección de la clase"/></label><p v-if="formError" class="form-error">{{ formError }}</p><p class="demo-note">Se guardará solo en memoria para esta demostración. No se enviarán invitaciones ni se crearán reuniones reales.</p></div>
        <footer class="modal-actions"><button class="secondary-button" @click="showCreate = false">Cancelar</button><button class="primary-button" @click="createSession">Agregar a la agenda <ArrowRight :size="16"/></button></footer>
      </div>
    </div>
  </div>
</template>
