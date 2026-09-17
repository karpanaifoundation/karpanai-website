/* ==========================================================================
   KARPANAI FOUNDATION - main.js
   jQuery-powered playful interactions
   ========================================================================== */
$(function () {

  /* ---------------- Mobile nav toggle ---------------- */
  $('#navToggle').on('click', function () {
    $('#navLinks').toggleClass('open');
    $(this).attr('aria-expanded', $('#navLinks').hasClass('open'));
  });
  $('#navLinks a').on('click', function () {
    $('#navLinks').removeClass('open');
  });

  /* ---------------- Active nav link ---------------- */
  var here = location.pathname.replace(/\/index\.html$/, '/');
  if (here.slice(-1) !== '/') here += '/';
  $('.nav-links a').each(function () {
    var link = $(this).attr('href');
    var target = new URL(link, location.href).pathname;
    if (target.slice(-1) !== '/') target += '/';
    if (target === here) {
      $(this).addClass('active');
    }
  });

  /* ---------------- Scroll reveal + doodle underline ---------------- */
  var revealTargets = $('.reveal, .doodle-underline');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealTargets.each(function () { io.observe(this); });
  } else {
    revealTargets.addClass('in-view');
  }

  /* ---------------- Animated counters (stat numbers) ---------------- */
  function animateCount($el) {
    var raw = $el.data('count');
    if (raw === undefined) return;
    var suffix = $el.data('suffix') || '';
    var prefix = $el.data('prefix') || '';
    var target = parseFloat(raw);
    var isDecimal = raw.toString().indexOf('.') > -1;
    var start = 0;
    var duration = 1400;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = start + (target - start) * eased;
      $el.text(prefix + (isDecimal ? value.toFixed(2) : Math.floor(value)) + suffix);
      if (progress < 1) requestAnimationFrame(step);
      else $el.text(prefix + (isDecimal ? target.toFixed(2) : target) + suffix);
    }
    requestAnimationFrame(step);
  }

  var counted = false;
  var $stats = $('.stat .num[data-count]');
  if ($stats.length && 'IntersectionObserver' in window) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          $stats.each(function () { animateCount($(this)); });
        }
      });
    }, { threshold: 0.3 });
    statIO.observe($stats.get(0).closest('section') || $stats.get(0));
  }

  /* ---------------- Subject picker (home hero interactive) ---------------- */
  var subjectData = {
    history: {
      title: 'History → Theatre',
      text: 'What if Kovalan walked the streets of Chennai today? Picture a descriptive animation of him walking with the anklet - and on his way to the king, it either gets lost along the way, or the king turns out to have a cheap copy of his own, thanks to inflation.'
    },
    geography: {
      title: 'Geography → Music',
      text: 'Writing a song about a piece of geography - a couple of lines on the rich heritage of Chennai\'s soil.'
    },
    civics: {
      title: 'Civics → Debate',
      text: 'An example of a Model United Nations in action - with more from the session in our drive.',
      link: 'https://drive.google.com/file/d/1HLOJDf0hkhMHUpPTcUO_064eMw_Vx3mC/view?usp=sharing'
    },
    social: {
      title: 'Social Issues → Art',
      text: 'Some political art - theatre pictures, and books like Pink World, written by Karthik, on discrimination and more.'
    }
  };
  var $pickerBtns = $('.picker-btn');
  var $stageTitle = $('#pickerTitle');
  var $stageText = $('#pickerText');
  var $stageLink = $('#pickerLink');

  function showSubject(key) {
    if (!subjectData[key]) return;
    $pickerBtns.removeClass('active').filter('[data-subject="' + key + '"]').addClass('active');
    $stageTitle.fadeOut(120, function () {
      $stageTitle.text(subjectData[key].title).fadeIn(180);
    });
    $stageText.fadeOut(120, function () {
      $stageText.text(subjectData[key].text).fadeIn(180);
    });
    if (subjectData[key].link) {
      $stageLink.attr('href', subjectData[key].link).show();
    } else {
      $stageLink.hide();
    }
  }

  $pickerBtns.on('click', function () {
    showSubject($(this).data('subject'));
  });

  $('.chip-link').on('click', function (e) {
    e.preventDefault();
    showSubject($(this).data('subject'));
    $('html, body').animate({ scrollTop: $('#picker').offset().top - 30 }, 500);
  });

  /* ---------------- Flipbook (Method section) ---------------- */
  $('.flip-card').on('click', function () {
    $(this).toggleClass('flipped');
  });

  /* ---------------- Story category tabs ---------------- */
  $('.story-tab').on('click', function () {
    var cat = $(this).data('cat');
    $('.story-tab').removeClass('active');
    $(this).addClass('active');
    if (cat === 'all') {
      $('.story-card').fadeIn(200);
    } else {
      $('.story-card').each(function () {
        if ($(this).data('cat') === cat) $(this).fadeIn(200);
        else $(this).fadeOut(150);
      });
    }
  });

  /* ---------------- Copy-to-clipboard (donate page) ---------------- */
  $('.copy-btn').on('click', function () {
    var text = $(this).data('copy');
    var $btn = $(this);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        var original = $btn.text();
        $btn.text('Copied!');
        setTimeout(function () { $btn.text(original); }, 1500);
      });
    }
  });

  /* ---------------- Contact / newsletter form (demo submit) ---------------- */
  $('.js-form').on('submit', function (e) {
    e.preventDefault();
    var $form = $(this);
    $form.find('.form-submit').prop('disabled', true).text('Sending…');
    setTimeout(function () {
      $form.slideUp(200);
      $form.siblings('.form-success').slideDown(220);
    }, 700);
  });

  /* ---------------- Back to top ---------------- */
  var $toTop = $('#toTop');
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 500) $toTop.addClass('show');
    else $toTop.removeClass('show');
  });
  $toTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500);
  });

  /* ---------------- "What would you change?" canvas ---------------- */
  var canvas = document.getElementById('imaginationCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var drawing = false;
    var currentColor = '#172B4D';
    var last = { x: 0, y: 0 };

    function resizeCanvas() {
      var ratio = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.scale(ratio, ratio);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 4;
    }
    resizeCanvas();
    window.addEventListener('resize', function () {
      var imgData = canvas.toDataURL();
      resizeCanvas();
      var img = new Image();
      img.onload = function () { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); };
      img.src = imgData;
    });

    function getPos(evt) {
      var rect = canvas.getBoundingClientRect();
      var clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
      var clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }
    function start(evt) {
      drawing = true;
      last = getPos(evt);
    }
    function move(evt) {
      if (!drawing) return;
      evt.preventDefault();
      var pos = getPos(evt);
      ctx.strokeStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      last = pos;
    }
    function end() { drawing = false; }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: true });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);

    $('.color-dot').on('click', function () {
      $('.color-dot').removeClass('active');
      $(this).addClass('active');
      currentColor = $(this).data('color');
    });
    $('#clearCanvas').on('click', function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  /* ---------------- Scrapbook lightbox (full-screen photo/artifact viewer) ---------------- */
  var $lightbox, currentGroup = [], currentIndex = 0;

  function buildLightbox() {
    if ($lightbox) return;
    $lightbox = $(
      '<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">' +
        '<div class="lightbox-figure">' +
          '<img class="lightbox-img" alt="">' +
          '<p class="lightbox-cap"></p>' +
          '<span class="lightbox-counter"></span>' +
          '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close">✕</button>' +
          '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous image">‹</button>' +
          '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next image">›</button>' +
          '<button type="button" class="lightbox-btn lightbox-full" aria-label="Toggle fullscreen">⛶</button>' +
        '</div>' +
      '</div>'
    ).appendTo('body');

    $lightbox.on('click', function (e) {
      if (e.target === this) closeLightbox();
    });
    $lightbox.find('.lightbox-close').on('click', closeLightbox);
    $lightbox.find('.lightbox-prev').on('click', function () { showSlide(currentIndex - 1); });
    $lightbox.find('.lightbox-next').on('click', function () { showSlide(currentIndex + 1); });
    $lightbox.find('.lightbox-full').on('click', function () {
      var el = $lightbox[0];
      var request = el.requestFullscreen || el.webkitRequestFullscreen;
      var exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (!document.fullscreenElement && request) {
        request.call(el);
      } else if (exit) {
        exit.call(document);
      }
    });

    var touchStartX = null;
    $lightbox.find('.lightbox-figure').on('touchstart', function (e) {
      touchStartX = e.originalEvent.touches[0].clientX;
    }).on('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.originalEvent.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) showSlide(currentIndex + (dx < 0 ? 1 : -1));
      touchStartX = null;
    });
  }

  function showSlide(i) {
    if (!currentGroup.length) return;
    currentIndex = (i + currentGroup.length) % currentGroup.length;
    var item = currentGroup[currentIndex];
    $lightbox.find('.lightbox-img').attr('src', item.full).attr('alt', item.caption || '');
    $lightbox.find('.lightbox-cap').text(item.caption || '');
    $lightbox.find('.lightbox-counter').text((currentIndex + 1) + ' / ' + currentGroup.length);
    var multi = currentGroup.length > 1;
    $lightbox.find('.lightbox-prev, .lightbox-next').toggle(multi);
  }

  function openLightbox(group, index) {
    buildLightbox();
    currentGroup = group;
    showSlide(index);
    $lightbox.addClass('open');
    $('body').css('overflow', 'hidden');
  }

  function closeLightbox() {
    if (!$lightbox) return;
    $lightbox.removeClass('open');
    $('body').css('overflow', '');
    var exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (document.fullscreenElement && exit) exit.call(document);
  }

  $(document).on('keydown', function (e) {
    if (!$lightbox || !$lightbox.hasClass('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
  });

  $('.scrap-gallery').each(function () {
    var $items = $(this).find('.scrap-item[data-full]');
    var group = [];
    $items.each(function (i) {
      $(this).attr({ 'data-idx': i, tabindex: 0, role: 'button' });
      group.push({ full: $(this).data('full'), caption: $(this).data('caption') || '' });
    });
    $items.on('click', function (e) {
      e.preventDefault();
      openLightbox(group, $(this).data('idx'));
    }).on('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $(this).trigger('click'); }
    });
  });

});
