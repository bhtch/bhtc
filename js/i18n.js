/**
 * 多语言切换模块 (中文/英文/俄文)
 * 用法: 在HTML元素上添加 data-i18n="key" 属性
 * 通过 localStorage 记住用户选择的语言
 */
const BHTC = {
    currentLang: 'ru',
    companyName: '百贺天成',
    domain: 'www.xjbhtch.com',

    // 三语翻译字典
    translations: {
        // 导航
        'nav.home':      { zh: '首页', en: 'Home', ru: 'Главная' },
        'nav.products':  { zh: '产品中心', en: 'Products', ru: 'Продукция' },
        'nav.about':     { zh: '关于我们', en: 'About Us', ru: 'О компании' },
        'nav.contact':   { zh: '联系我们', en: 'Contact', ru: 'Контакты' },
        'nav.services':  { zh: '服务', en: 'Services', ru: 'Услуги' },

        // 首页 Hero
        'hero.title':    { zh: '中国工程机械直供', en: 'Construction Machinery from China', ru: 'Строительная техника из Китая' },
        'hero.subtitle': { zh: '柳工、国机重工、陕汽——挖掘机、装载机、自卸车及特种车辆。厂家直供，品质保障，售后无忧。', en: 'Excavators, loaders, dump trucks and special vehicles from LiuGong, SINOMACH and SAGMOTO. Direct supply, warranty and service.', ru: 'Экскаваторы, погрузчики, самосвалы и спецтехника от LiuGong, SINOMACH и SAGMOTO. Прямые поставки, гарантия и сервис.' },
        'hero.catalog':  { zh: '查看产品目录', en: 'View Catalog', ru: 'Смотреть каталог' },
        'hero.whatsapp': { zh: 'WhatsApp咨询', en: 'WhatsApp Us', ru: 'Написать в WhatsApp' },

        // 品牌
        'brands.title':      { zh: '合作品牌', en: 'Our Brands', ru: 'Наши бренды' },
        'brands.liugong':    { zh: '柳工拥有60余年工程机械制造经验，产品涵盖挖掘机、装载机、平地机、压路机等。', en: 'Over 60 years of experience. Excavators, loaders, graders, rollers and electric equipment.', ru: 'Экскаваторы, погрузчики, автогрейдеры, дорожные катки и электротехника. Более 60 лет опыта.' },
        'brands.liugong.btn':{ zh: '柳工产品', en: 'LiuGong Catalog', ru: 'Каталог LiuGong' },
        'brands.sinomach':   { zh: '国机重工是中国大型央企，专业生产挖掘机、装载机、压路机等工程机械。', en: 'China state-owned corporation. Excavators, loaders, rollers and special machinery.', ru: 'Экскаваторы, погрузчики, дорожные катки и спецтехника. Государственная корпорация Китая.' },
        'brands.sinomach.btn':{ zh: '国机产品', en: 'SINOMACH Catalog', ru: 'Каталог SINOMACH' },
        'brands.sagmoto':    { zh: '陕汽商用车，自卸车、随车吊、牵引车、搅拌车等特种车辆，中国直发。', en: 'Dump trucks, crane trucks, tractors, mixer trucks. Delivery from China.', ru: 'Самосвалы, манипуляторы, тягачи, бетономешалки, спецмашины. Доставка из Китая.' },
        'brands.sagmoto.btn':{ zh: '陕汽产品', en: 'SAGMOTO Catalog', ru: 'Каталог SAGMOTO' },

        // 热门产品
        'popular.title':  { zh: '热门机械', en: 'Popular Machinery', ru: 'Популярная техника' },
        'popular.viewall':{ zh: '查看全部产品', en: 'View All Products', ru: 'Смотреть весь каталог' },

        // 优势
        'advantages.title':  { zh: '我们的优势', en: 'Our Advantages', ru: 'Наши преимущества' },
        'advantages.direct': { zh: '厂家直供', en: 'Direct Supply', ru: 'Прямые поставки' },
        'advantages.direct.desc': { zh: '与柳工、国机重工、陕汽工厂直接合作', en: 'Directly with LiuGong, SINOMACH and SAGMOTO factories', ru: 'Работаем напрямую с заводами LiuGong, SINOMACH и SAGMOTO' },
        'advantages.quality':{ zh: '品质保障', en: 'Quality Guarantee', ru: 'Гарантия качества' },
        'advantages.quality.desc': { zh: '所有设备经过严格检验，手续齐全', en: 'All machines inspected and come with full documentation', ru: 'Все машины проходят проверку и комплектуются документами' },
        'advantages.delivery':{ zh: '配送至独联体', en: 'Delivery to CIS', ru: 'Доставка в СНГ' },
        'advantages.delivery.desc': { zh: '可配送至俄罗斯、哈萨克斯坦、吉尔吉斯斯坦等国', en: 'Delivery to Russia, Kazakhstan, Kyrgyzstan and other countries', ru: 'Организуем доставку в Россию, Казахстан, Кыргызстан и другие страны' },
        'advantages.fast':   { zh: '快速响应', en: 'Fast Response', ru: 'Быстрая связь' },
        'advantages.fast.desc': { zh: 'WhatsApp咨询，1小时内回复', en: 'WhatsApp inquiry, reply within 1 hour', ru: 'Пишите нам в WhatsApp — ответим в течение часа' },

        // 产品页
        'products.title':     { zh: '产品目录', en: 'Product Catalog', ru: 'Каталог техники' },
        'products.subtitle':  { zh: '中国知名品牌挖掘机、装载机、自卸车及特种车辆', en: 'Excavators, loaders, dump trucks and special vehicles from top Chinese brands', ru: 'Экскаваторы, погрузчики, самосвалы и спецтехника от ведущих производителей Китая' },
        'products.filter':    { zh: '筛选:', en: 'Filter:', ru: 'Фильтр:' },
        'products.search':    { zh: '搜索型号...', en: 'Search model...', ru: 'Поиск по модели...' },
        'products.all':       { zh: '全部', en: 'All', ru: 'Все' },
        'products.ask':       { zh: '询价', en: 'Ask Price', ru: 'По запросу' },
        'products.whatsapp':  { zh: 'WhatsApp咨询', en: 'WhatsApp', ru: 'WhatsApp' },
        'products.details':   { zh: '查看详情', en: 'Details', ru: 'Подробнее' },

        // 关于页
        'about.title':        { zh: '关于百贺天成', en: 'About BHTC', ru: 'О компании 百贺天成' },
        'about.subtitle':     { zh: '自2005年起，工程机械领域值得信赖的合作伙伴', en: 'Your reliable partner in construction machinery since 2005', ru: 'Надежный партнер в сфере строительной техники с 2005 года' },
        'about.mission':      { zh: '我们的使命', en: 'Our Mission', ru: 'Наша миссия' },
        'about.mission.desc': { zh: '为建筑企业提供现代化、可靠、高效的机械设备，助力各类项目顺利实施。', en: 'To provide construction companies with modern, reliable and efficient machinery for successful project implementation.', ru: 'Обеспечивать строительные компании современной, надежной и эффективной техникой для успешной реализации проектов любой сложности.' },
        'about.mission.p1':   { zh: '百贺天成自2005年起深耕工程机械行业，已发展成为值得信赖的优质设备供应商。', en: 'BHTC has been working in the construction machinery industry since 2005, establishing itself as a reliable supplier of quality equipment.', ru: 'Компания "百贺天成" работает на рынке строительного оборудования с 2005 года. За это время мы зарекомендовали себя как надежный поставщик качественной техники.' },
        'about.mission.p2':   { zh: '我们专注于工程机械的销售、维修保养及操作人员培训服务。', en: 'We specialize in the sales, maintenance and repair of construction machinery, as well as operator training services.', ru: 'Мы специализируемся на поставках, сервисном обслуживании и ремонте строительной техники, а также предоставляем услуги по обучению операторов и технического персонала.' },
        'about.stats.years':  { zh: '年行业经验', en: 'Years of Experience', ru: 'Лет на рынке' },
        'about.stats.years.desc': { zh: '自2005年成功运营', en: 'Successful operation since 2005', ru: 'Успешной работы с 2005 года' },
        'about.stats.units':  { zh: '台设备', en: 'Units of Equipment', ru: 'Единиц техники' },
        'about.stats.units.desc': { zh: '产品目录', en: 'In our catalog', ru: 'В нашем каталоге' },
        'about.stats.clients':{ zh: '位满意客户', en: 'Satisfied Clients', ru: 'Довольных клиентов' },
        'about.stats.clients.desc': { zh: '遍布俄罗斯及独联体', en: 'Across Russia and CIS', ru: 'По всей России и СНГ' },
        'about.stats.staff':  { zh: '位认证专家', en: 'Certified Specialists', ru: 'Сертифицированных специалистов' },
        'about.stats.staff.desc': { zh: '技术支持团队', en: 'Technical support team', ru: 'Техническая поддержка' },
        'about.values.title': { zh: '企业价值观', en: 'Our Values', ru: 'Наши ценности' },
        'about.values.trust': { zh: '可靠', en: 'Reliability', ru: 'Надежность' },
        'about.values.trust.desc': { zh: '保证设备品质，按时履行对客户的承诺。', en: 'We guarantee equipment quality and fulfill all commitments to clients on time.', ru: 'Мы гарантируем качество поставляемой техники и выполняем все обязательства перед клиентами в оговоренные сроки.' },
        'about.values.quality':{ zh: '品质', en: 'Quality', ru: 'Качество' },
        'about.values.quality.desc': { zh: '与经过验证的制造商合作，每台设备发货前严格检验。', en: 'Working only with verified manufacturers, every machine is thoroughly inspected before delivery.', ru: 'Работаем только с проверенными производителями, вся техника проходит тщательную проверку перед поставкой.' },
        'about.values.support':{ zh: '服务', en: 'Support', ru: 'Поддержка' },
        'about.values.support.desc': { zh: '全天候技术支持、维修保养及配件供应。', en: '24/7 technical support, maintenance service and spare parts supply.', ru: 'Круглосуточная техническая поддержка, сервисное обслуживание и обеспечение запчастями.' },
        'about.history.title':{ zh: '发展历程', en: 'Company History', ru: 'История компании' },

        // 联系页
        'contact.title':      { zh: '联系我们', en: 'Contact Us', ru: 'Контакты' },
        'contact.subtitle':   { zh: '获取工程机械咨询，请随时与我们联系', en: 'Get in touch for construction machinery consultation', ru: 'Свяжитесь с нами для получения консультации по строительной технике' },
        'contact.whatsapp.title': { zh: 'WhatsApp', en: 'WhatsApp', ru: 'WhatsApp' },
        'contact.whatsapp.quick': { zh: '快速联系:', en: 'Quick contact:', ru: 'Быстрая связь:' },
        'contact.whatsapp.hint': { zh: '给我们发消息——1小时内回复！', en: 'Message us - reply within 1 hour!', ru: 'Пишите нам — ответим в течение часа!' },
        'contact.whatsapp.btn': { zh: '立即发送', en: 'Message Now', ru: 'Написать сейчас' },
        'contact.email.title': { zh: '电子邮箱', en: 'Email', ru: 'Электронная почта' },
        'contact.email.general': { zh: '一般咨询:', en: 'General inquiries:', ru: 'Общие вопросы:' },
        'contact.email.sales': { zh: '销售部:', en: 'Sales department:', ru: 'Отдел продаж:' },
        'contact.hours.title': { zh: '营业时间', en: 'Business Hours', ru: 'Режим работы' },
        'contact.hours.weekday': { zh: '周一至周五:', en: 'Mon - Fri:', ru: 'Пн - Пт:' },
        'contact.hours.weekday.time': { zh: '9:00 - 18:00', en: '9:00 - 18:00', ru: '9:00 - 18:00' },
        'contact.hours.sat': { zh: '周六:', en: 'Sat:', ru: 'Сб:' },
        'contact.hours.sat.time': { zh: '10:00 - 16:00', en: '10:00 - 16:00', ru: '10:00 - 16:00' },
        'contact.hours.sun': { zh: '周日:', en: 'Sun:', ru: 'Вс:' },
        'contact.hours.sun.time': { zh: '休息', en: 'Closed', ru: 'Выходной' },
        'contact.hours.whatsapp24': { zh: 'WhatsApp全天候在线', en: 'WhatsApp available 24/7', ru: 'WhatsApp доступен круглосуточно' },
        'contact.form.title': { zh: '发送消息', en: 'Send Message', ru: 'Отправить сообщение' },
        'contact.form.name':  { zh: '您的姓名 *', en: 'Your Name *', ru: 'Ваше имя *' },
        'contact.form.phone': { zh: '电话 *', en: 'Phone *', ru: 'Телефон *' },
        'contact.form.email': { zh: '电子邮箱 *', en: 'Email *', ru: 'Электронная почта *' },
        'contact.form.company':{ zh: '公司', en: 'Company', ru: 'Компания' },
        'contact.form.subject':{ zh: '主题', en: 'Subject', ru: 'Тема сообщения' },
        'contact.form.subject.placeholder': { zh: '请选择主题', en: 'Select subject', ru: 'Выберите тему' },
        'contact.form.subject.sales': { zh: '设备咨询', en: 'Equipment Inquiry', ru: 'Консультация по технике' },
        'contact.form.subject.support': { zh: '技术支持', en: 'Technical Support', ru: 'Техническая поддержка' },
        'contact.form.subject.parts': { zh: '配件与零部件', en: 'Spare Parts', ru: 'Запчасти и комплектующие' },
        'contact.form.subject.service': { zh: '维修保养', en: 'Maintenance', ru: 'Сервисное обслуживание' },
        'contact.form.subject.other': { zh: '其他', en: 'Other', ru: 'Другое' },
        'contact.form.message':{ zh: '消息内容 *', en: 'Message *', ru: 'Сообщение *' },
        'contact.form.agree': { zh: '我同意处理个人数据', en: 'I agree to the processing of personal data', ru: 'Я соглашаюсь на обработку персональных данных' },
        'contact.form.submit': { zh: '发送消息', en: 'Send Message', ru: 'Отправить сообщение' },
        'contact.why.title':  { zh: '为什么选择我们', en: 'Why Choose Us', ru: 'Почему выбирают нас' },
        'contact.why.direct': { zh: '厂家直供', en: 'Direct Supply', ru: 'Прямые поставки' },
        'contact.why.direct.desc': { zh: '与中国工厂直接合作，无中间商', en: 'Working directly with factories in China, no middlemen', ru: 'Работаем напрямую с заводами-производителями в Китае без посредников' },
        'contact.why.docs':   { zh: '全程办理', en: 'Full Documentation', ru: 'Полное оформление' },
        'contact.why.docs.desc': { zh: '协助办理报关、认证及文件手续', en: 'Customs clearance, certificates and documentation', ru: 'Помогаем с таможенным оформлением, сертификатами и документацией' },
        'contact.why.lang':   { zh: '中文/俄语服务', en: 'Chinese/Russian Support', ru: 'Русскоязычная поддержка' },
        'contact.why.lang.desc': { zh: '全程中文或俄语沟通，协助交易各环节', en: 'Communication in Chinese or Russian throughout the deal', ru: 'Общаемся на русском языке, помогаем на всех этапах сделки' },

        // 服务页
        'services.title':     { zh: '我们的服务', en: 'Our Services', ru: 'Наши услуги' },
        'services.subtitle':  { zh: '工程机械综合解决方案：从销售到售后维修', en: 'Comprehensive solutions: from sales to after-sales service', ru: 'Комплексные решения для строительной техники: от продажи до сервисного обслуживания' },
        'services.maintenance':    { zh: '维修保养', en: 'Maintenance', ru: 'Сервисное обслуживание' },
        'services.maintenance.desc': { zh: '工程机械定期保养、维修及故障诊断，品质保障。', en: 'Regular maintenance, repair and diagnostics. Quality guaranteed.', ru: 'Регулярное техническое обслуживание, ремонт и диагностика строительной техники. Гарантия качества работ.' },
        'services.parts':     { zh: '配件供应', en: 'Spare Parts', ru: 'Поставка запчастей' },
        'services.parts.desc':{ zh: '原厂及优质副厂配件，快速配送至俄罗斯各地。', en: 'Original and quality aftermarket parts. Fast delivery across Russia.', ru: 'Оригинальные и качественные аналоги запчастей для строительной техники. Быстрая доставка по всей России.' },
        'services.training':  { zh: '操作培训', en: 'Operator Training', ru: 'Обучение операторов' },
        'services.training.desc': { zh: '工程机械操作员专业培训，颁发资格证书。', en: 'Professional operator training with certification.', ru: 'Профессиональное обучение операторов строительной техники. Сертификация и повышение квалификации.' },
        'services.process.title': { zh: '合作流程', en: 'How We Work', ru: 'Процесс работы с нами' },
        'services.process.1': { zh: '咨询', en: 'Consultation', ru: 'Консультация' },
        'services.process.1.desc': { zh: '分析需求，推荐最佳方案', en: 'Analyze needs and recommend the best solution', ru: 'Анализ потребностей и подбор оптимального решения' },
        'services.process.2': { zh: '选型', en: 'Selection', ru: 'Подбор техники' },
        'services.process.2.desc': { zh: '从产品目录中选择合适的设备', en: 'Select the right equipment from our catalog', ru: 'Выбор подходящей техники из нашего каталога' },
        'services.process.3': { zh: '融资', en: 'Financing', ru: 'Финансирование' },
        'services.process.3.desc': { zh: '选择最优付款方案', en: 'Choose the best payment plan', ru: 'Подбор оптимальной схемы финансирования' },
        'services.process.4': { zh: '售后', en: 'After-sales', ru: 'Обслуживание' },
        'services.process.4.desc': { zh: '维修保养及技术支持', en: 'Maintenance and technical support', ru: 'Сервисное сопровождение и техническая поддержка' },
        'services.extra.title': { zh: '增值服务', en: 'Additional Services', ru: 'Дополнительные услуги' },
        'services.extra.lease': { zh: '融资租赁', en: 'Leasing & Credit', ru: 'Лизинг и кредит' },
        'services.extra.delivery': { zh: '物流配送', en: 'Delivery & Logistics', ru: 'Доставка и логистика' },
        'services.extra.audit': { zh: '技术评估', en: 'Technical Audit', ru: 'Технический аудит' },
        'services.faq.title': { zh: '常见问题', en: 'FAQ', ru: 'Часто задаваемые вопросы' },

        // 关于页 - 补充
        'about.mission.title':    { zh: '我们的使命', en: 'Our Mission', ru: 'Наша миссия' },
        'about.mission.p0':       { zh: '为建筑企业提供现代化、可靠、高效的机械设备，助力各类项目顺利实施。', en: 'To provide construction companies with modern, reliable and efficient machinery for successful project implementation.', ru: 'Обеспечивать строительные компании современной, надежной и эффективной техникой для успешной реализации проектов любой сложности.' },
        'about.mission.p1':       { zh: '百贺天成自2005年起深耕工程机械行业，已发展成为值得信赖的优质设备供应商。', en: 'BHTC has been working in the construction machinery industry since 2005, establishing itself as a reliable supplier of quality equipment.', ru: 'Компания "百贺天成" работает на рынке строительного оборудования с 2005 года. За это время мы зарекомендовали себя как надежный поставщик качественной техники.' },
        'about.mission.p2':       { zh: '我们专注于工程机械的销售、维修保养及操作人员培训服务。', en: 'We specialize in the sales, maintenance and repair of construction machinery, as well as operator training services.', ru: 'Мы специализируемся на поставках, сервисном обслуживании и ремонте строительной техники, а также предоставляем услуги по обучению операторов и технического персонала.' },
        'about.stats.years.num':  { zh: '18+', en: '18+', ru: '18+' },
        'about.stats.units.num':  { zh: '500+', en: '500+', ru: '500+' },
        'about.stats.clients.num':{ zh: '1200+', en: '1200+', ru: '1200+' },
        'about.stats.staff.num':  { zh: '50+', en: '50+', ru: '50+' },
        'about.values.trust.p':   { zh: '保证设备品质，按时履行对客户的承诺。', en: 'We guarantee equipment quality and fulfill all commitments to clients on time.', ru: 'Мы гарантируем качество поставляемой техники и выполняем все обязательства перед клиентами в оговоренные сроки.' },
        'about.values.quality.p': { zh: '与经过验证的制造商合作，每台设备发货前严格检验。', en: 'Working only with verified manufacturers, every machine is thoroughly inspected before delivery.', ru: 'Работаем только с проверенными производителями, вся техника проходит тщательную проверку перед поставкой.' },
        'about.values.support.p': { zh: '全天候技术支持、维修保养及配件供应。', en: '24/7 technical support, maintenance service and spare parts supply.', ru: 'Круглосуточная техническая поддержка, сервисное обслуживание и обеспечение запчастями.' },
        'about.history.2005':     { zh: '公司成立，以小型设备起步。', en: 'Company founded. Started with a small fleet of machinery.', ru: 'Основание компании. Начало работы с малым парком техники.' },
        'about.history.2008':     { zh: '扩大产品线，开始与柳工、国机重工合作。', en: 'Expanded product range. Started cooperation with LiuGong and SINOMACH.', ru: 'Расширение ассортимента. Начало сотрудничества с LiuGong и SINOMACH.' },
        'about.history.2012':     { zh: '在西安设立服务中心，团队扩大至50人。', en: 'Opened service center in Xi\'an. Team expanded to 50 staff.', ru: 'Открытие сервисного центра в Сиане. Увеличение штата до 50 сотрудников.' },
        'about.history.2015':     { zh: '业务扩展至俄罗斯及独联体国家。', en: 'Expanded operations to Russia and CIS countries.', ru: 'Расширение географии поставок по России и СНГ.' },
        'about.history.2018':     { zh: '上线在线产品目录和远程咨询系统。', en: 'Launched online catalog and remote consultation system.', ru: 'Запуск онлайн-каталога и системы дистанционных консультаций.' },
        'about.history.2023':     { zh: '引入设备监控系统和客户数字化服务。', en: 'Introduced equipment monitoring and digital services for clients.', ru: 'Внедрение системы мониторинга техники и цифровых сервисов для клиентов.' },
        'about.team.title':       { zh: '管理团队', en: 'Management Team', ru: 'Руководство компании' },

        // 联系页 - 补充
        'contact.card.whatsapp':  { zh: 'WhatsApp', en: 'WhatsApp', ru: 'WhatsApp' },
        'contact.card.quick':     { zh: '快速联系:', en: 'Quick contact:', ru: 'Быстрая связь:' },
        'contact.card.hint':      { zh: '给我们发消息——1小时内回复！', en: 'Message us - reply within 1 hour!', ru: 'Пишите нам — ответим в течение часа!' },
        'contact.card.btn':       { zh: '立即发送', en: 'Message Now', ru: 'Написать сейчас' },
        'contact.card.email':     { zh: '电子邮箱', en: 'Email', ru: 'Электронная почта' },
        'contact.card.email.gen': { zh: '一般咨询:', en: 'General inquiries:', ru: 'Общие вопросы:' },
        'contact.card.email.sales':{ zh: '销售部:', en: 'Sales department:', ru: 'Отдел продаж:' },
        'contact.card.hours':     { zh: '营业时间', en: 'Business Hours', ru: 'Режим работы' },
        'contact.card.weekday':   { zh: '周一至周五:', en: 'Mon - Fri:', ru: 'Пн - Пт:' },
        'contact.card.weekday.t': { zh: '9:00 - 18:00', en: '9:00 - 18:00', ru: '9:00 - 18:00' },
        'contact.card.sat':       { zh: '周六:', en: 'Sat:', ru: 'Сб:' },
        'contact.card.sat.t':     { zh: '10:00 - 16:00', en: '10:00 - 16:00', ru: '10:00 - 16:00' },
        'contact.card.sun':       { zh: '周日:', en: 'Sun:', ru: 'Вс:' },
        'contact.card.sun.t':     { zh: '休息', en: 'Closed', ru: 'Выходной' },
        'contact.card.whatsapp24':{ zh: 'WhatsApp全天候在线', en: 'WhatsApp available 24/7', ru: 'WhatsApp доступен круглосуточно' },
        'contact.form.title':     { zh: '发送消息', en: 'Send Message', ru: 'Отправить сообщение' },
        'contact.form.name':      { zh: '您的姓名 *', en: 'Your Name *', ru: 'Ваше имя *' },
        'contact.form.phone':     { zh: '电话 *', en: 'Phone *', ru: 'Телефон *' },
        'contact.form.email':     { zh: '电子邮箱 *', en: 'Email *', ru: 'Электронная почта *' },
        'contact.form.company':   { zh: '公司', en: 'Company', ru: 'Компания' },
        'contact.form.subject':   { zh: '主题', en: 'Subject', ru: 'Тема сообщения' },
        'contact.form.subject.ph':{ zh: '请选择主题', en: 'Select subject', ru: 'Выберите тему' },
        'contact.form.subject.sales': { zh: '设备咨询', en: 'Equipment Inquiry', ru: 'Консультация по технике' },
        'contact.form.subject.support':{ zh: '技术支持', en: 'Technical Support', ru: 'Техническая поддержка' },
        'contact.form.subject.parts':  { zh: '配件与零部件', en: 'Spare Parts', ru: 'Запчасти и комплектующие' },
        'contact.form.subject.service':{ zh: '维修保养', en: 'Maintenance', ru: 'Сервисное обслуживание' },
        'contact.form.subject.other':  { zh: '其他', en: 'Other', ru: 'Другое' },
        'contact.form.message':   { zh: '消息内容 *', en: 'Message *', ru: 'Сообщение *' },
        'contact.form.agree':     { zh: '我同意处理个人数据', en: 'I agree to the processing of personal data', ru: 'Я соглашаюсь на обработку персональных данных' },
        'contact.form.submit':    { zh: '发送消息', en: 'Send Message', ru: 'Отправить сообщение' },
        'contact.map.title':      { zh: '联系我们', en: 'Contact Us', ru: 'Свяжитесь с нами' },
        'contact.map.desc':       { zh: '在WhatsApp中快速咨询', en: 'Message us on WhatsApp for quick consultation', ru: 'Пишите в WhatsApp для быстрой консультации' },
        'contact.map.btn':        { zh: '发送', en: 'Message', ru: 'Написать' },
        'contact.quick.title':    { zh: '快速联系', en: 'Quick Contact', ru: 'Быстрая связь' },
        'contact.quick.desc':     { zh: '在WhatsApp快速回复:', en: 'For a quick response, message us on WhatsApp:', ru: 'Для быстрого ответа напишите нам в WhatsApp:' },
        'contact.quick.btn':      { zh: 'WhatsApp咨询', en: 'WhatsApp Us', ru: 'Написать в WhatsApp' },
        'contact.social.title':   { zh: '社交媒体', en: 'Social Media', ru: 'Мы в социальных сетях' },
        'contact.why.title':      { zh: '为什么选择我们', en: 'Why Choose Us', ru: 'Почему выбирают нас' },

        // 服务页 - 补充
        'services.main.maint.title': { zh: '维修保养', en: 'Maintenance', ru: 'Сервисное обслуживание' },
        'services.main.maint.desc':  { zh: '工程机械定期保养、维修及故障诊断，品质保障。', en: 'Regular maintenance, repair and diagnostics. Quality guaranteed.', ru: 'Регулярное техническое обслуживание, ремонт и диагностика строительной техники. Гарантия качества работ.' },
        'services.main.maint.l1':    { zh: '计划保养', en: 'Scheduled maintenance', ru: 'Плановое ТО' },
        'services.main.maint.l2':    { zh: '快速诊断', en: 'Express diagnostics', ru: 'Экспресс-диагностика' },
        'services.main.maint.l3':    { zh: '大修服务', en: 'Overhaul repair', ru: 'Капитальный ремонт' },
        'services.main.maint.l4':    { zh: '质保服务', en: 'Work warranty', ru: 'Гарантия на работы' },
        'services.main.parts.title': { zh: '配件供应', en: 'Spare Parts', ru: 'Поставка запчастей' },
        'services.main.parts.desc':  { zh: '原厂及优质副厂配件，快速配送至俄罗斯各地。', en: 'Original and quality aftermarket parts. Fast delivery across Russia.', ru: 'Оригинальные и качественные аналоги запчастей для строительной техники. Быстрая доставка по всей России.' },
        'services.main.parts.l1':    { zh: '原厂配件', en: 'Original parts', ru: 'Оригинальные запчасти' },
        'services.main.parts.l2':    { zh: '优质副厂件', en: 'Quality alternatives', ru: 'Качественные аналоги' },
        'services.main.parts.l3':    { zh: '快速配送', en: 'Fast delivery', ru: 'Быстрая доставка' },
        'services.main.parts.l4':    { zh: '配件质保', en: 'Parts warranty', ru: 'Гарантия на запчасти' },
        'services.main.train.title': { zh: '操作培训', en: 'Operator Training', ru: 'Обучение операторов' },
        'services.main.train.desc':  { zh: '工程机械操作员专业培训，颁发资格证书。', en: 'Professional operator training with certification.', ru: 'Профессиональное обучение операторов строительной техники. Сертификация и повышение квалификации.' },
        'services.main.train.l1':    { zh: '基础培训', en: 'Basic training', ru: 'Базовое обучение' },
        'services.main.train.l2':    { zh: '进阶培训', en: 'Advanced training', ru: 'Повышение квалификации' },
        'services.main.train.l3':    { zh: '资格认证', en: 'Certification', ru: 'Сертификация' },
        'services.main.train.l4':    { zh: '远程课程', en: 'Remote courses', ru: 'Дистанционные курсы' },
        'services.process.title':    { zh: '合作流程', en: 'How We Work', ru: 'Процесс работы с нами' },
        'services.extra.title':      { zh: '增值服务', en: 'Additional Services', ru: 'Дополнительные услуги' },
        'services.extra.lease.title':{ zh: '融资租赁', en: 'Leasing & Credit', ru: 'Лизинг и кредит' },
        'services.extra.lease.desc': { zh: '灵活的融资租赁和信贷方案，协助办理手续。', en: 'Flexible leasing and credit terms. Assistance with documentation.', ru: 'Гибкие условия лизинга и кредитования строительной техники. Помощь в оформлении документов.' },
        'services.extra.lease.l1':   { zh: '租赁1年起', en: 'Leasing from 1 year', ru: 'Лизинг от 1 года' },
        'services.extra.lease.l2':   { zh: '信贷3年起', en: 'Credit from 3 years', ru: 'Кредит от 3 лет' },
        'services.extra.lease.l3':   { zh: '首付10%起', en: 'Down payment from 10%', ru: 'Первоначальный взнос от 10%' },
        'services.extra.delivery.title': { zh: '物流配送', en: 'Delivery & Logistics', ru: 'Доставка и логистика' },
        'services.extra.delivery.desc': { zh: '配送至俄罗斯各地，办理进口清关手续。', en: 'Delivery across Russia. Import customs clearance.', ru: 'Организация доставки техники в любую точку России. Таможенное оформление импортной техники.' },
        'services.extra.delivery.l1':  { zh: '俄罗斯全国配送', en: 'Delivery across Russia', ru: 'Доставка по РФ' },
        'services.extra.delivery.l2':  { zh: '现场安装', en: 'On-site installation', ru: 'Монтаж на месте' },
        'services.extra.delivery.l3':  { zh: '清关服务', en: 'Customs clearance', ru: 'Таможенное оформление' },
        'services.extra.audit.title': { zh: '技术评估', en: 'Technical Audit', ru: 'Технический аудит' },
        'services.extra.audit.desc':  { zh: '设备状态综合评估，维护和升级建议。', en: 'Comprehensive equipment assessment. Maintenance and upgrade recommendations.', ru: 'Комплексная оценка состояния строительной техники. Рекомендации по обслуживанию и модернизации.' },
        'services.extra.audit.l1':    { zh: '设备诊断', en: 'Equipment diagnostics', ru: 'Диагностика техники' },
        'services.extra.audit.l2':    { zh: '磨损评估', en: 'Wear assessment', ru: 'Оценка износа' },
        'services.extra.audit.l3':    { zh: '维修建议', en: 'Repair recommendations', ru: 'Рекомендации по ремонту' },
        'services.faq.q1':        { zh: '设备提供什么质保？', en: 'What warranty is provided on equipment?', ru: 'Какая гарантия предоставляется на технику?' },
        'services.faq.a1':        { zh: '新设备享有制造商1至3年质保（视品牌型号而定）。二手设备享有6个月质保。所有质保条款均写入合同。', en: 'New equipment comes with 1-3 years manufacturer warranty (varies by brand/model). Used equipment has 6 months warranty. All warranty terms are in the contract.', ru: 'На новую технику предоставляется гарантия от производителя от 1 до 3 лет в зависимости от марки и модели. На технику с пробегом - гарантия от 6 месяцев. Все гарантийные обязательства прописываются в договоре.' },
        'services.faq.q2':        { zh: '售后服务是怎样的？', en: 'How does after-sales service work?', ru: 'Как происходит сервисное обслуживание?' },
        'services.faq.a2':        { zh: '我们提供多种售后方式：现场上门诊断、服务中心维修，以及年度维保合同。', en: 'We offer several service options: on-site diagnostics, service center repair, and annual maintenance contracts.', ru: 'Мы предлагаем несколько вариантов сервисного обслуживания: выездная диагностика на объекте, обслуживание в нашем сервисном центре, а также заключение договора на годовое сервисное сопровождение с фиксированной стоимостью.' },
        'services.faq.q3':        { zh: '可以融资租赁设备吗？', en: 'Can I get equipment on lease?', ru: 'Можно ли получить технику в лизинг?' },
        'services.faq.a3':        { zh: '可以，我们与多家融资租赁公司和银行合作，协助您选择最优方案并办理手续。', en: 'Yes, we work with leading leasing companies and banks to help you find the best plan.', ru: 'Да, мы сотрудничаем с ведущими лизинговыми компаниями и банками. Помогаем подобрать оптимальную схему лизинга или кредитования, сопровождаем процесс оформления документов.' },
        'services.faq.q4':        { zh: '有操作员培训吗？', en: 'Is operator training available?', ru: 'Есть ли обучение для операторов?' },
        'services.faq.a4':        { zh: '有的，我们提供工程机械操作员培训，包含理论和实操，结业颁发证书。', en: 'Yes, we provide operator training including theory and practice on simulators and real machines. Certificate upon completion.', ru: 'Да, мы проводим обучение операторов строительной техники. Обучение включает теоретическую часть и практику на тренажерах и реальной технике. По окончании выдается сертификат.' },
        'services.faq.q5':        { zh: '配件多久能到？', en: 'How quickly can I get spare parts?', ru: 'Как быстро можно получить запчасти?' },
        'services.faq.a5':        { zh: '多数配件现货配送1-2天，进口配件7-21天。紧急需要可安排快递。', en: 'Most parts are in stock - 1-2 day delivery. Imported parts arrive in 7-21 days. Express delivery available for urgent needs.', ru: 'Большинство запчастей есть на складе - доставка 1-2 дня. Импортные запчасти доставляются от 7 до 21 дня в зависимости от производителя. При срочной необходимости организуем экспресс-доставку.' },

        // 页脚补充
        'footer.home':           { zh: '首页', en: 'Home', ru: 'Главная' },
        'footer.catalog':        { zh: '产品目录', en: 'Catalog', ru: 'Каталог' },
        'footer.about':          { zh: '关于我们', en: 'About Us', ru: 'О компании' },
        'footer.contact':        { zh: '联系我们', en: 'Contact', ru: 'Контакты' },
        'footer.desc':           { zh: '专业工程机械及设备供应商，为您的项目保驾护航。', en: 'Professional construction machinery and equipment supplier for your projects.', ru: 'Профессиональная строительная техника и оборудование для ваших проектов.' },
        'footer.contacts':       { zh: '联系方式', en: 'Contacts', ru: 'Контакты' },
        'footer.links':          { zh: '快速链接', en: 'Quick Links', ru: 'Быстрые ссылки' },
        'footer.copyright':      { zh: '百贺天成 版权所有', en: 'BHTC All Rights Reserved', ru: '百贺天成 Все права защищены' },

        // 分类筛选
        'cat.all':            { zh: '全部', en: 'All', ru: 'Все' },
        'cat.excavators':     { zh: '挖掘机', en: 'Excavators', ru: 'Экскаваторы' },
        'cat.loaders':        { zh: '装载机', en: 'Loaders', ru: 'Погрузчики' },
        'cat.graders':        { zh: '平地机', en: 'Graders', ru: 'Автогрейдеры' },
        'cat.rollers':        { zh: '压路机', en: 'Road Rollers', ru: 'Дорожные катки' },
        'cat.trucks':         { zh: '自卸车/卡车', en: 'Dump Trucks', ru: 'Самосвалы' },
        'cat.special':        { zh: '特种车辆', en: 'Special Vehicles', ru: 'Спецмашины' },
        'cat.forklifts':      { zh: '叉车', en: 'Forklifts', ru: 'Вилочные погрузчики' },
        'cat.backhoe':        { zh: '挖掘装载机', en: 'Backhoe Loaders', ru: 'Обратные лопаты' },
    },

    // 初始化
    init: function() {
        const saved = localStorage.getItem('bhtc_lang') || 'ru';
        this.currentLang = saved;
        this.applyLang();
        this.renderSwitcher();
    },

    // 切换语言
    setLang: function(lang) {
        this.currentLang = lang;
        localStorage.setItem('bhtc_lang', lang);
        this.applyLang();
        // 更新切换器按钮状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    },

    // 应用翻译到所有 data-i18n 元素
    applyLang: function() {
        const lang = this.currentLang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.t(key, lang);
            if (text) {
                el.textContent = text;
            }
        });
        // 更新 data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const text = this.t(key, lang);
            if (text) {
                el.placeholder = text;
            }
        });
        // 更新 data-i18n-html
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const text = this.t(key, lang);
            if (text) {
                el.innerHTML = text;
            }
        });
        // 更新 html lang
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
        // 触发自定义事件，让其他脚本也能响应语言切换
        document.dispatchEvent(new CustomEvent('bhtc:langchange', { detail: { lang: lang } }));
    },

    // 获取翻译文本
    t: function(key, lang) {
        if (!lang) lang = this.currentLang;
        const entry = this.translations[key];
        if (!entry) return null;
        return entry[lang] || entry['ru'] || entry['en'] || key;
    },

    // 渲染语言切换器（插入到 .lang-switcher 容器中）
    renderSwitcher: function() {
        const container = document.querySelector('.lang-switcher');
        if (!container) return;
        const langs = [
            { code: 'zh', label: '中文' },
            { code: 'en', label: 'EN' },
            { code: 'ru', label: 'RU' },
        ];
        container.innerHTML = langs.map(l =>
            `<button class="lang-btn btn btn-sm ${l.code === this.currentLang ? 'active' : ''}" data-lang="${l.code}">${l.label}</button>`
        ).join('');
        container.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setLang(btn.dataset.lang));
        });
    }
};

document.addEventListener('DOMContentLoaded', () => BHTC.init());
