/* ==========================================================================
   ملف الوظائف المشتركة (Shared JavaScript) - منصة سكينة
   يحتوي على:
   - بناء الهيدر (القائمة العلوية) والفوتر تلقائياً في كل صفحة
   - التحكم في قائمة الجوال
   - تمرين التنفس الهادئ (4-7-8) التفاعلي
   - نافذة قراءة المقالات التوعوية
   - نافذة إرسال طلب استشارة سرية لمستشار
   ========================================================================== */

// 1. رسم الهيدر والفوتر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderFooter();
    injectSharedModals();
});

// دالة تحديد الصفحة الحالية لتلوين الرابط النشط في القائمة
function getCurrentPageName() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1);
    return file || 'index.html';
}

// دالة بناء شعار سكينة SVG
function getLogoHTML(isLight = false) {
    const lightClass = isLight ? 'light' : '';
    return `
        <a href="index.html" class="logo-box ${lightClass}">
            <div class="logo-icon ${lightClass}">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 21c-4.5-3-7-7-7-11.5C5 5.9 8.1 3 12 3s7 2.9 7 6.5C19 14 16.5 18 12 21z" />
                    <path d="M12 7v14" />
                    <path d="M12 13l3.5-2.5" />
                    <path d="M12 16l-3.5-2.5" />
                </svg>
            </div>
            <div>
                <span class="logo-title">سكينة</span>
                <span class="logo-sub">Sakina</span>
            </div>
        </a>
    `;
}

// 2. دالة بناء الشريط العلوي (Header)
function renderHeader() {
    const container = document.getElementById('site-header');
    if (!container) return;

    const user = getCurrentUser();
    const page = getCurrentPageName();

    // تحديد رابط لوحة المستخدم حسب نوع حسابه
    let dashHref = 'profile.html';
    let dashLabel = '👤 ملفي الشخصي';
    if (user && user.role === 'admin') {
        dashHref = 'admin-dashboard.html';
        dashLabel = '⚙️ لوحة الإدارة';
    } else if (user && user.role === 'specialist') {
        dashHref = 'specialist-dashboard.html';
        dashLabel = '🩺 لوحة المستشار';
    }

    const authButtons = user
        ? `
            <a href="${dashHref}" class="btn btn-secondary btn-sm">${dashLabel}</a>
            <button type="button" onclick="logoutUser()" class="btn btn-danger btn-sm">خروج</button>
          `
        : `
            <a href="login.html" class="btn btn-secondary btn-sm">تسجيل الدخول</a>
            <a href="login.html?tab=register" class="btn btn-primary btn-sm">حساب جديد</a>
          `;

    container.className = 'site-header';
    container.innerHTML = `
        <div class="container header-inner">
            ${getLogoHTML(false)}

            <nav class="nav-links">
                <a href="index.html" class="${page === 'index.html' ? 'active' : ''}">الرئيسية</a>
                <a href="assessment.html" class="${page === 'assessment.html' ? 'active' : ''}">الاختبار النفسي</a>
                <a href="specialists.html" class="${page === 'specialists.html' ? 'active' : ''}">دليل المستشارين</a>
                <a href="articles.html" class="${page === 'articles.html' ? 'active' : ''}">المقالات التوعوية</a>
            </nav>

            <div class="header-actions">
                ${authButtons}
            </div>

            <button type="button" class="mobile-menu-btn" onclick="toggleMobileNav()">☰</button>
        </div>

        <div id="mobile-nav" class="mobile-nav">
            <a href="index.html">الرئيسية</a>
            <a href="assessment.html">الاختبار النفسي</a>
            <a href="specialists.html">دليل المستشارين</a>
            <a href="articles.html">المقالات التوعوية</a>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--cream-200); display: flex; gap: 8px;">
                ${authButtons}
            </div>
        </div>
    `;
}

// فتح وإغلاق قائمة الجوال
function toggleMobileNav() {
    const nav = document.getElementById('mobile-nav');
    if (nav) nav.classList.toggle('open');
}

// تسجيل الخروج
function logoutUser() {
    setCurrentUser(null);
    window.location.href = 'index.html';
}

// 3. دالة بناء التذييل (Footer)
function renderFooter() {
    const container = document.getElementById('site-footer');
    if (!container) return;

    container.className = 'site-footer';
    container.innerHTML = `
        <div class="container">
            <div class="footer-top">
                ${getLogoHTML(true)}

                <div class="footer-links">
                    <a href="index.html">الرئيسية</a>
                    <a href="assessment.html">مقياس التقييم الأولي</a>
                    <a href="specialists.html">دليل المستشارين</a>
                    <a href="articles.html">المقالات التوعوية</a>
                    <a href="login.html?role=specialist">بوابة المختصين</a>
                    <a href="login.html?role=admin">بوابة الإدارة</a>
                </div>

                <div class="footer-pill">
                    🔒 تقييم أولي غير تشخيصي • سرية تامة 100%
                </div>
            </div>

            <div class="footer-bottom">
                جميع الحقوق محفوظة © منصة سكينة للدعم والاستشارات النفسية 2026
            </div>
        </div>
    `;
}

// 4. إضافة النوافذ المنبثقة المشتركة (تمرين التنفس، قراءة المقال، طلب الاستشارة)
function injectSharedModals() {
    const modalsHTML = `
        <!-- نافذة تمرين التنفس الهادئ 4-7-8 -->
        <div id="breathing-modal" class="modal-backdrop" onclick="closeBreathingModal()">
            <div class="modal-box" style="max-width: 440px; text-align: center;" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3 style="font-size: 18px; font-weight: 800; color: var(--sakina-800);">🌬️ تمرين التنفس الهادئ (4-7-8)</h3>
                    <button type="button" class="modal-close" onclick="closeBreathingModal()">✕</button>
                </div>
                <p style="font-size: 13px; color: var(--text-muted);">
                    خذ دقيقة واحدة لتهدئة نبضات قلبك وتخفيف التوتر اللحظي
                </p>
                <div id="breathing-circle" class="breathing-circle">
                    <div id="breathing-count" style="font-size: 36px; font-weight: 800; color: var(--sakina-800);">4-7-8</div>
                    <div id="breathing-unit" style="font-size: 12px; font-weight: 700; color: var(--sakina-700);">جاهز للبدء</div>
                </div>
                <p id="breathing-instruction" style="font-size: 16px; font-weight: 800; color: var(--sakina-800); margin-bottom: 20px;">
                    اضغط ابدأ واتبع حركة الدائرة
                </p>
                <button type="button" id="breathing-toggle-btn" class="btn btn-primary btn-lg" onclick="toggleBreathing()">
                    ▶️ ابدأ التمرين
                </button>
            </div>
        </div>

        <!-- نافذة قراءة المقال كاملاً -->
        <div id="article-modal" class="modal-backdrop" onclick="closeArticleModal()">
            <div class="modal-box" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <div>
                        <span id="art-modal-cat" class="badge badge-sakina"></span>
                        <h3 id="art-modal-title" style="font-size: 22px; font-weight: 800; color: var(--sakina-800); margin-top: 8px;"></h3>
                        <p id="art-modal-meta" style="font-size: 12px; color: var(--text-muted); margin-top: 4px;"></p>
                    </div>
                    <button type="button" class="modal-close" onclick="closeArticleModal()">✕</button>
                </div>
                <div id="art-modal-content" style="border-top: 1px solid var(--cream-200); padding-top: 16px; white-space: pre-line; line-height: 1.9; font-size: 15px; color: #374151;"></div>
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--cream-200); text-align: left;">
                    <button type="button" class="btn btn-primary" onclick="closeArticleModal()">إغلاق</button>
                </div>
            </div>
        </div>

        <!-- نافذة طلب تواصل واستشارة أولية -->
        <div id="consultation-modal" class="modal-backdrop" onclick="closeConsultationModal()">
            <div class="modal-box" style="max-width: 500px;" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <div>
                        <span class="badge badge-sakina">📩 طلب تواصل أولي سري</span>
                        <h3 id="consult-sp-name" style="font-size: 20px; font-weight: 800; color: var(--sakina-800); margin-top: 8px;"></h3>
                        <p id="consult-sp-spec" style="font-size: 12px; color: var(--text-muted);"></p>
                    </div>
                    <button type="button" class="modal-close" onclick="closeConsultationModal()">✕</button>
                </div>

                <form id="consultation-form" onsubmit="submitConsultationForm(event)">
                    <input type="hidden" id="consult-sp-id">
                    <input type="hidden" id="consult-assessment-id">

                    <div class="form-group">
                        <label class="form-label">الاسم (أو اسم مستعار للخصوصية)</label>
                        <input type="text" id="consult-name" class="form-control" required>
                    </div>

                    <div class="grid-2" style="gap: 12px;">
                        <div class="form-group">
                            <label class="form-label">رقم التواصل / واتساب</label>
                            <input type="text" id="consult-phone" class="form-control" placeholder="77xxxxxxx" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">الوقت المفضل للتواصل</label>
                            <select id="consult-time" class="form-control">
                                <option value="الصباح (9:00 - 12:00)">الصباح (9:00 - 12:00)</option>
                                <option value="الظهيرة (1:00 - 4:00)">الظهيرة (1:00 - 4:00)</option>
                                <option value="المساء (5:00 - 8:00)" selected>المساء (5:00 - 8:00)</option>
                                <option value="أي وقت مناسب">أي وقت مناسب</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">ملاحظة مختصرة للمستشار (اختياري)</label>
                        <textarea id="consult-notes" rows="3" class="form-control" placeholder="اكتب باختصار ما تشعر به أو سبب طلب التواصل..."></textarea>
                    </div>

                    <div id="consult-consent-box" class="form-group" style="display: none;">
                        <label style="display: flex; align-items: flex-start; gap: 8px; padding: 12px; border-radius: 12px; background: var(--sakina-50); border: 1px solid var(--sakina-200); font-size: 12px; cursor: pointer;">
                            <input type="checkbox" id="consult-share-check" checked style="margin-top: 3px;">
                            <span><strong>موافقة الخصوصية:</strong> أوافق على مشاركة نتيجة تقييمي النفسي الحالي مع هذا المختص لتسهيل فهم حالتي.</span>
                        </label>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block" style="padding: 13px;">
                        إرسال طلب التواصل الآمن
                    </button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalsHTML);
}

/* ---------- منطق تمرين التنفس (4-7-8) ---------- */
const BREATH_PHASES = [
    { label: 'شهيق عميق عبر الأنف...', seconds: 4, cls: 'expand' },
    { label: 'احبس أنفاسك بهدوء...', seconds: 7, cls: 'hold' },
    { label: 'زفير بطيء ومريح...', seconds: 8, cls: 'shrink' }
];
let breathTimer = null;
let breathRunning = false;
let breathPhaseIdx = 0;
let breathSeconds = 4;

function openBreathingModal() {
    document.getElementById('breathing-modal').classList.add('open');
}

function closeBreathingModal() {
    stopBreathing();
    document.getElementById('breathing-modal').classList.remove('open');
}

function toggleBreathing() {
    if (breathRunning) {
        stopBreathing();
    } else {
        startBreathing();
    }
}

function startBreathing() {
    breathRunning = true;
    breathPhaseIdx = 0;
    breathSeconds = BREATH_PHASES[0].seconds;
    document.getElementById('breathing-toggle-btn').textContent = '⏸️ إيقاف مؤقت';
    updateBreathingUI();

    breathTimer = setInterval(function () {
        if (breathSeconds > 1) {
            breathSeconds--;
        } else {
            breathPhaseIdx = (breathPhaseIdx + 1) % BREATH_PHASES.length;
            breathSeconds = BREATH_PHASES[breathPhaseIdx].seconds;
        }
        updateBreathingUI();
    }, 1000);
}

function stopBreathing() {
    breathRunning = false;
    clearInterval(breathTimer);
    document.getElementById('breathing-toggle-btn').textContent = '▶️ ابدأ التمرين';
    document.getElementById('breathing-circle').className = 'breathing-circle';
    document.getElementById('breathing-count').textContent = '4-7-8';
    document.getElementById('breathing-unit').textContent = 'جاهز للبدء';
    document.getElementById('breathing-instruction').textContent = 'اضغط ابدأ واتبع حركة الدائرة';
}

function updateBreathingUI() {
    const phase = BREATH_PHASES[breathPhaseIdx];
    document.getElementById('breathing-circle').className = 'breathing-circle ' + phase.cls;
    document.getElementById('breathing-count').textContent = breathSeconds;
    document.getElementById('breathing-unit').textContent = 'ثانية';
    document.getElementById('breathing-instruction').textContent = phase.label;
}

/* ---------- منطق نافذة قراءة المقال ---------- */
function openArticleModal(articleId) {
    const data = getSakinaData();
    const article = data.articles.find(a => a.id === articleId);
    if (!article) return;

    document.getElementById('art-modal-cat').textContent = article.category;
    document.getElementById('art-modal-title').textContent = article.title;
    document.getElementById('art-modal-meta').textContent = `بقلم: ${article.author_name} • وقت القراءة: ${article.reading_time} دقائق`;
    document.getElementById('art-modal-content').textContent = article.content;
    document.getElementById('article-modal').classList.add('open');
}

function closeArticleModal() {
    document.getElementById('article-modal').classList.remove('open');
}

/* ---------- منطق نافذة طلب الاستشارة ---------- */
function openConsultationModal(specialistId, assessmentId = null) {
    const data = getSakinaData();
    const sp = data.specialists.find(s => s.id === specialistId);
    if (!sp) return;

    const user = getCurrentUser();
    document.getElementById('consult-sp-id').value = sp.id;
    document.getElementById('consult-assessment-id').value = assessmentId || '';
    document.getElementById('consult-sp-name').textContent = 'طلب استشارة مع ' + sp.name;
    document.getElementById('consult-sp-spec').textContent = sp.specialty;
    document.getElementById('consult-name').value = user ? user.name : '';
    document.getElementById('consult-phone').value = user ? (user.phone || '') : '';
    document.getElementById('consult-notes').value = '';

    // إظهار خيار موافقة مشاركة نتيجة التقييم فقط إذا كان هناك تقييم مرتبط
    document.getElementById('consult-consent-box').style.display = assessmentId ? 'block' : 'none';
    document.getElementById('consultation-modal').classList.add('open');
}

function closeConsultationModal() {
    document.getElementById('consultation-modal').classList.remove('open');
}

function submitConsultationForm(e) {
    e.preventDefault();
    const data = getSakinaData();
    const spId = Number(document.getElementById('consult-sp-id').value);
    const sp = data.specialists.find(s => s.id === spId);
    const assessmentIdRaw = document.getElementById('consult-assessment-id').value;
    const assessmentId = assessmentIdRaw ? Number(assessmentIdRaw) : null;
    const shareAssessment = assessmentId ? document.getElementById('consult-share-check').checked : false;

    let assessmentScore = null;
    if (assessmentId && shareAssessment) {
        const found = data.assessments.find(a => a.id === assessmentId);
        if (found) assessmentScore = found.total_score;
    }

    const user = getCurrentUser();
    const newReq = {
        id: Date.now(),
        user_id: user ? user.id : null,
        specialist_id: sp.id,
        specialist_name: sp.name,
        assessment_id: shareAssessment ? assessmentId : null,
        assessment_score: assessmentScore,
        share_assessment: shareAssessment,
        beneficiary_name: document.getElementById('consult-name').value.trim(),
        beneficiary_phone: document.getElementById('consult-phone').value.trim(),
        preferred_time: document.getElementById('consult-time').value,
        notes: document.getElementById('consult-notes').value.trim(),
        specialist_notes: '',
        status: 'pending',
        created_at: new Date().toISOString().slice(0, 10)
    };

    data.consultations.unshift(newReq);
    saveSakinaData(data);

    closeConsultationModal();
    alert('✅ تم إرسال طلب التواصل الآمن بنجاح! سيتواصل معك المستشار في الوقت المفضل.');
}
