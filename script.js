// ========== GAME DATA ==========
var GAMES = [
  { id:1,  title:"CYBER ODYSSEY",  genre:"ACTION",   year:2024, price:59.99, icon:"🤖", rating:5, desc:"A neon-soaked cyberpunk action RPG set in a sprawling megacity. Hack, fight, and explore in this open-world adventure with deep character customization and a branching storyline.", badge:"HOT"  },
  { id:2,  title:"DRAGON FORGE",   genre:"RPG",      year:2024, price:49.99, icon:"🐉", rating:5, desc:"Embark on an epic fantasy journey as a dragon rider. Forge powerful weapons, build alliances, and battle ancient evils in a richly crafted world full of lore and mystery.", badge:null  },
  { id:3,  title:"VOID TACTICS",   genre:"STRATEGY", year:2023, price:39.99, icon:"🚀", rating:4, desc:"Command your fleet across the galaxy in this deep real-time strategy game. Manage resources, research technology, and outmaneuver enemy admirals in tactical space battles.", badge:"SALE" },
  { id:4,  title:"APEX TURBO 24",  genre:"RACING",   year:2024, price:44.99, icon:"🏎️", rating:4, desc:"The most realistic racing simulator ever made. 200+ cars, 50 tracks worldwide, and a dynamic weather system that changes everything. Feel every corner.", badge:null  },
  { id:5,  title:"SHADOW HUNT",    genre:"HORROR",   year:2023, price:29.99, icon:"👻", rating:4, desc:"A terrifying first-person survival horror experience. You are being hunted by an entity that learns from you. No two playthroughs are the same.", badge:null  },
  { id:6,  title:"GALACTIC FC",    genre:"SPORTS",   year:2024, price:0,     icon:"⚽", rating:4, desc:"The ultimate free-to-play football game with realistic physics, online multiplayer for up to 22 players, and stunning visual effects. Build your dream team!", badge:"FREE" },
  { id:7,  title:"NEON DESCENT",   genre:"ACTION",   year:2024, price:19.99, icon:"⚡", rating:5, desc:"A high-speed roguelite action game where you descend through procedurally generated neon dungeons. Every death makes you stronger. How deep can you go?", badge:"NEW"  },
  { id:8,  title:"EMPIRE BUILDER", genre:"STRATEGY", year:2023, price:34.99, icon:"🏰", rating:3, desc:"Build and expand your empire from a small village to a vast civilization spanning continents. Diplomacy, warfare, and economics are all in your hands.", badge:null  },
  { id:9,  title:"CHRONO RIFTS",   genre:"RPG",      year:2024, price:54.99, icon:"⏰", rating:5, desc:"Time-travel RPG with branching timelines. Every decision echoes across eras. Master the flow of time, recruit companions from different centuries, and rewrite history.", badge:"HOT"  },
  { id:10, title:"MONSTER BASH",   genre:"ACTION",   year:2023, price:0,     icon:"🦊", rating:3, desc:"A free-to-play beat-em-up with an adorable art style and surprisingly deep combat. Play solo or co-op with up to 4 friends online.", badge:"FREE" },
  { id:11, title:"VELOCITY X",     genre:"RACING",   year:2024, price:24.99, icon:"🏍️", rating:4, desc:"Motorcycle racing at its most extreme. Anti-gravity tracks, futuristic bikes, and insane stunts. Unlock new bikes as you master each increasingly wild circuit.", badge:"NEW"  },
  { id:12, title:"DARK MANOR",     genre:"HORROR",   year:2023, price:14.99, icon:"🕯️", rating:4, desc:"An atmospheric puzzle-horror set in a cursed Victorian mansion. Uncover the dark secrets of the Blackwood family as you solve increasingly disturbing puzzles.", badge:null  }
];

// ========== STATE (localStorage) ==========
function getState() {
  try {
    return {
      cart:       JSON.parse(localStorage.getItem('nx_cart'))       || [],
      library:    JSON.parse(localStorage.getItem('nx_library'))    || [],
      balance:    parseFloat(localStorage.getItem('nx_balance'))    || 100,
      totalSpent: parseFloat(localStorage.getItem('nx_spent'))      || 0
    };
  } catch(e) { return { cart:[], library:[], balance:100, totalSpent:0 }; }
}

function saveState(s) {
  localStorage.setItem('nx_cart',    JSON.stringify(s.cart));
  localStorage.setItem('nx_library', JSON.stringify(s.library));
  localStorage.setItem('nx_balance', s.balance);
  localStorage.setItem('nx_spent',   s.totalSpent);
}

// ========== NAV BADGE ========== 
function updateNavBadge() {
  var s   = getState();
  var el  = document.getElementById('cartCount');
  var bal = document.getElementById('balanceDisplay');
  if (el)  el.textContent  = s.cart.length;
  if (bal) bal.textContent = '💰 $' + s.balance.toFixed(2);
}

// ========== SHARED HELPERS ==========
function getCardBG(id) {
  var bgs = [
    'linear-gradient(135deg,#0d1b4b,#1a0a3d)',
    'linear-gradient(135deg,#1a0a00,#3d1a00)',
    'linear-gradient(135deg,#0a1a0d,#1a3d0a)',
    'linear-gradient(135deg,#1a0a1a,#3d003d)',
    'linear-gradient(135deg,#1a0000,#3d0000)',
    'linear-gradient(135deg,#001a0d,#00261a)',
    'linear-gradient(135deg,#1a1a00,#3d3300)',
    'linear-gradient(135deg,#0a0a1a,#1a1a3d)',
    'linear-gradient(135deg,#1a000d,#3d0020)',
    'linear-gradient(135deg,#001a1a,#003d3d)',
    'linear-gradient(135deg,#1a0a0a,#3d1a1a)',
    'linear-gradient(135deg,#0a1a1a,#0a2626)'
  ];
  return bgs[(id-1) % bgs.length];
}

function getStars(r) {
  var out = '';
  for (var i = 0; i < 5; i++) out += '<span class="star' + (i < r ? '' : ' empty') + '">★</span>';
  return out;
}

// ========== TOAST ==========
var _toastTimer;
function showToast(msg, isError) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent       = msg;
  t.style.borderColor = isError ? 'var(--accent2)' : 'var(--accent)';
  t.style.color       = isError ? 'var(--accent2)' : 'var(--accent)';
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() { t.classList.remove('show'); }, 2500);
}

// ========== CART ACTIONS ==========
function handleAddToCart(id) {
  var s    = getState();
  var game = null;
  for (var i = 0; i < GAMES.length; i++) { if (GAMES[i].id === id) { game = GAMES[i]; break; } }
  if (!game) return;
  if (s.library.some(function(l){ return l.id === id; })) return;

  var inCart = s.cart.some(function(c){ return c.id === id; });
  if (inCart) {
    s.cart = s.cart.filter(function(c){ return c.id !== id; });
    showToast('Removed "' + game.title + '" from cart');
  } else {
    s.cart.push(game);
    showToast('Added "' + game.title + '" to cart');
  }
  saveState(s);
  updateNavBadge();
  return s;
}

function addFunds(amount) {
  var s = getState();
  s.balance += amount;
  saveState(s);
  showToast('💰 Added $' + amount + ' to your balance!');
  updateNavBadge();
}

// ========== STORE PAGE ==========
function initStorePage() {
  var currentFilter = 'ALL';
  var searchQuery   = '';

  function renderGrid() {
    var s    = getState();
    var grid = document.getElementById('gamesGrid');
    var filtered = GAMES.filter(function(g) {
      var mf = currentFilter === 'ALL' || (currentFilter === 'FREE' ? g.price === 0 : g.genre === currentFilter);
      var ms = g.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
               g.genre.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
      return mf && ms;
    });

    if (!filtered.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--muted);font-family:Orbitron,monospace">NO GAMES FOUND</div>';
      return;
    }

    grid.innerHTML = filtered.map(function(g, i) {
      var inCart  = s.cart.some(function(c){ return c.id === g.id; });
      var owned   = s.library.some(function(l){ return l.id === g.id; });
      var btnText = owned ? 'OWNED' : (inCart ? 'IN CART' : (g.price === 0 ? 'GET FREE' : 'ADD TO CART'));
      var btnCls  = 'add-btn' + (owned ? ' owned' : (inCart ? ' in-cart' : ''));
      var price   = g.price === 0 ? 'FREE' : '$' + g.price.toFixed(2);
      var pCls    = g.price === 0 ? 'game-price free' : 'game-price';
      return '<div class="game-card' + (owned ? ' owned' : '') + '" style="animation-delay:' + (i*0.05) + 's" data-id="' + g.id + '" data-action="open-modal">' +
        (g.badge ? '<div class="game-badge">' + g.badge + '</div>' : '') +
        (owned   ? '<div class="owned-badge">✓ OWNED</div>' : '') +
        '<div class="game-thumb-bg" style="background:' + getCardBG(g.id) + '"><span style="position:relative;z-index:1">' + g.icon + '</span></div>' +
        '<div class="game-info">' +
          '<div class="game-title">' + g.title + '</div>' +
          '<div class="game-genre">' + g.genre + ' · ' + g.year + '</div>' +
          '<div class="game-rating">' + getStars(g.rating) + '</div>' +
          '<div class="game-footer">' +
            '<div class="' + pCls + '">' + price + '</div>' +
            '<button class="' + btnCls + '"' + (owned ? ' disabled' : '') + ' data-id="' + g.id + '" data-action="add-to-cart">' + btnText + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // Fund buttons
  document.querySelectorAll('.fund-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      addFunds(parseFloat(btn.dataset.amount));
    });
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', function() {
    searchQuery   = this.value;
    currentFilter = 'ALL';
    document.querySelectorAll('.filter-btn').forEach(function(b, i) { b.classList.toggle('active', i === 0); });
    renderGrid();
  });

  // Filters
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      currentFilter = btn.dataset.filter;
      searchQuery   = '';
      document.getElementById('searchInput').value = '';
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderGrid();
    });
  });

  // Game grid delegation
  document.getElementById('gamesGrid').addEventListener('click', function(e) {
    var addBtn = e.target.closest('[data-action="add-to-cart"]');
    var card   = e.target.closest('[data-action="open-modal"]');
    if (addBtn) {
      e.stopPropagation();
      handleAddToCart(parseInt(addBtn.dataset.id, 10));
      renderGrid();
      return;
    }
    if (card) openModal(parseInt(card.dataset.id, 10));
  });

  // Modal
  var overlay = document.getElementById('modalOverlay');
  document.getElementById('modalCloseBtn').addEventListener('click', function() { overlay.classList.remove('show'); });
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.classList.remove('show'); });
  document.getElementById('modalAddBtn').addEventListener('click', function() {
    var id = parseInt(this.dataset.id, 10);
    if (!id || this.disabled) return;
    handleAddToCart(id);
    openModal(id);
  });

  function openModal(id) {
    var s    = getState();
    var game = null;
    for (var i = 0; i < GAMES.length; i++) { if (GAMES[i].id === id) { game = GAMES[i]; break; } }
    if (!game) return;

    var header = document.getElementById('modalHeader');
    header.style.background = getCardBG(game.id);
    // keep close button, set icon
    document.getElementById('modalIcon').textContent = game.icon;

    document.getElementById('modalTitle').textContent = game.title;
    var stars = '';
    for (var s2 = 0; s2 < 5; s2++) stars += s2 < game.rating ? '★' : '☆';
    document.getElementById('modalMeta').innerHTML =
      '<span class="meta-tag genre">' + game.genre + '</span>' +
      '<span class="meta-tag year">'  + game.year  + '</span>' +
      '<span class="meta-tag rating">'+ stars       + '</span>';
    document.getElementById('modalDesc').textContent  = game.desc;
    document.getElementById('modalPrice').textContent = game.price === 0 ? 'FREE' : '$' + game.price.toFixed(2);

    var owned  = s.library.some(function(l){ return l.id === game.id; });
    var inCart = s.cart.some(function(c)  { return c.id === game.id; });
    var btn = document.getElementById('modalAddBtn');
    btn.textContent = owned ? '✓ IN LIBRARY' : (inCart ? '✓ IN CART — REMOVE' : (game.price === 0 ? 'GET FREE' : 'ADD TO CART'));
    btn.className   = 'modal-add-btn' + (owned ? ' owned' : (inCart ? ' in-cart' : ''));
    btn.disabled    = owned;
    btn.dataset.id  = game.id;

    overlay.classList.add('show');
  }

  renderGrid();
  updateNavBadge();
}

// ========== CART PAGE ==========
function initCartPage() {
  function render() {
    var s       = getState();
    var itemsEl = document.getElementById('cartItems');
    var count   = s.cart.length;
    document.getElementById('cartTitle').textContent = '// ' + count + ' ITEM' + (count !== 1 ? 'S' : '');

    if (count === 0) {
      itemsEl.innerHTML = '<div class="empty-state"><div class="empty-icon">🛒</div><h3>YOUR CART IS EMPTY</h3><p>Head to the <a href="store.html">store</a> to find your next adventure</p></div>';
      document.getElementById('checkoutBtn').disabled = true;
    } else {
      itemsEl.innerHTML = s.cart.map(function(g) {
        return '<div class="cart-item">' +
          '<div class="cart-item-thumb" style="background:' + getCardBG(g.id) + '">' + g.icon + '</div>' +
          '<div class="cart-item-info"><div class="cart-item-title">' + g.title + '</div><div class="cart-item-genre">' + g.genre + ' · ' + g.year + '</div></div>' +
          '<div class="cart-item-price">' + (g.price === 0 ? 'FREE' : '$' + g.price.toFixed(2)) + '</div>' +
          '<button class="remove-btn" data-id="' + g.id + '">REMOVE</button>' +
        '</div>';
      }).join('');
      document.getElementById('checkoutBtn').disabled = false;
    }

    var total = s.cart.reduce(function(acc, g) { return acc + g.price; }, 0);
    document.getElementById('cartSubtotal').textContent = '$' + total.toFixed(2);
    document.getElementById('cartTotal').textContent    = '$' + total.toFixed(2);
    document.getElementById('cartBalance').textContent  = '$' + s.balance.toFixed(2);
    updateNavBadge();
  }

  // Remove buttons (delegated)
  document.getElementById('cartItems').addEventListener('click', function(e) {
    var btn = e.target.closest('.remove-btn');
    if (btn) { handleAddToCart(parseInt(btn.dataset.id, 10)); render(); }
  });

  // Checkout
  document.getElementById('checkoutBtn').addEventListener('click', function() {
    var s     = getState();
    var total = s.cart.reduce(function(acc, g) { return acc + g.price; }, 0);
    if (total > s.balance) { showToast('⚠️ INSUFFICIENT BALANCE', true); return; }
    s.balance    -= total;
    s.totalSpent += total;
    s.cart.forEach(function(g) {
      s.library.push(Object.assign({}, g, { purchaseDate: new Date().toLocaleDateString() }));
    });
    s.cart = [];
    saveState(s);
    showToast('✓ PURCHASE COMPLETE! ' + s.library.length + ' game' + (s.library.length !== 1 ? 's' : '') + ' in library');
    setTimeout(function() { window.location.href = 'library.html'; }, 1000);
    render();
  });

  render();
}

// ========== LIBRARY PAGE ==========
function initLibraryPage() {
  function render() {
    var s    = getState();
    var grid = document.getElementById('libraryGrid');
    var count = s.library.length;

    document.getElementById('libraryTitle').textContent = '// ' + count + ' GAME' + (count !== 1 ? 'S' : '');
    document.getElementById('libCount').textContent   = count;
    document.getElementById('libSpent').textContent   = '$' + s.totalSpent.toFixed(0);
    document.getElementById('libBalance').textContent = '$' + s.balance.toFixed(0);

    if (count === 0) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🎮</div><h3>LIBRARY EMPTY</h3><p>Purchase games from the <a href="store.html">store</a> to build your collection</p></div>';
    } else {
      grid.innerHTML = s.library.map(function(g, i) {
        return '<div class="library-card" style="animation-delay:' + (i*0.05) + 's">' +
          '<div class="library-thumb" style="background:' + getCardBG(g.id) + '">' + g.icon + '</div>' +
          '<div class="library-info">' +
            '<div class="library-title">' + g.title + '</div>' +
            '<div class="library-genre">' + g.genre + '</div>' +
            '<button class="play-btn" data-title="' + g.title + '">▶ PLAY</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }
    updateNavBadge();
  }

  document.getElementById('libraryGrid').addEventListener('click', function(e) {
    var btn = e.target.closest('.play-btn');
    if (btn) showToast('🎮 Launching "' + btn.dataset.title + '"...');
  });

  render();
}
