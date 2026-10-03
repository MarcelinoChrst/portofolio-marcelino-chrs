let sfxAktif = true;
let audioContextSFX = null;
let hpHero = 100;
let hpMonster = 100;
let kalkulatorBaru = true;

function toggleSFX() {
    sfxAktif = !sfxAktif;
    const tombol = document.getElementById('tombol-sfx');
    if (tombol) tombol.textContent = sfxAktif ? '🔊 SFX' : '🔇 SFX';
}

function mainkanSFXRetro() {
    const AudioContextSFX = window.AudioContext || window.webkitAudioContext;
    if (!sfxAktif || !AudioContextSFX) return;

    audioContextSFX ??= new AudioContextSFX();
    if (audioContextSFX.state === 'suspended') audioContextSFX.resume();

    const waktu = audioContextSFX.currentTime;
    const nada = audioContextSFX.createOscillator();
    const volume = audioContextSFX.createGain();
    nada.type = 'square';
    nada.frequency.setValueAtTime(660, waktu);
    nada.frequency.setValueAtTime(990, waktu + 0.045);
    volume.gain.setValueAtTime(0.0001, waktu);
    volume.gain.exponentialRampToValueAtTime(0.12, waktu + 0.01);
    volume.gain.exponentialRampToValueAtTime(0.0001, waktu + 0.11);
    nada.connect(volume);
    volume.connect(audioContextSFX.destination);
    nada.start(waktu);
    nada.stop(waktu + 0.12);
}

document.addEventListener('click', (event) => {
    if (event.target.closest('button, a')) mainkanSFXRetro();
});

function toggleCRT() {
    document.getElementById('crt-overlay')?.classList.toggle('matikan');
}

function toggleMenuMobile() {
    document.getElementById('nav-menu')?.classList.toggle('aktif');
}

function tutupMenuMobile() {
    document.getElementById('nav-menu')?.classList.remove('aktif');
}

function picuSeranganHero() {
    const hero = document.getElementById('petarung-hero');
    const enemy = document.getElementById('petarung-enemy');
    const log = document.getElementById('teks-log-battle');
    const barHero = document.getElementById('hero-hp-bar');
    const barEnemy = document.getElementById('enemy-hp-bar');
    if (!hero || !enemy || !log || !barHero || !barEnemy) return;

    if (hpMonster <= 0) {
        hpMonster = 100;
        hpHero = 100;
    }

    hpMonster = Math.max(0, hpMonster - 35);
    hpHero = Math.max(0, hpHero - 10);
    barEnemy.style.width = `${hpMonster}%`;
    barHero.style.width = `${hpHero}%`;

    hero.classList.remove('hero-serang');
    enemy.classList.remove('enemy-kena-hit');
    void hero.offsetWidth;
    hero.classList.add('hero-serang');
    enemy.classList.add('enemy-kena-hit');
    window.setTimeout(() => {
        hero.classList.remove('hero-serang');
        enemy.classList.remove('enemy-kena-hit');
    }, 450);

    if (hpMonster === 0) {
        log.textContent = '> CLEAN CODE SLASH! Bug Monster dikalahkan! Ronde berikutnya segera dimulai otomatis.';
    } else if (hpHero === 0) {
        log.textContent = '> Marcelino terkena serangan balik! HP pulih, pertarungan otomatis berlanjut.';
        hpHero = 100;
        barHero.style.width = '100%';
    } else {
        log.textContent = `> CLEAN CODE SLASH mengenai monster! HP Monster: ${hpMonster}/100 — HP Marcelino: ${hpHero}/100.`;
    }
}

function filterQuest(kategori, tombol) {
    document.querySelectorAll('.item-quest').forEach((quest) => {
        quest.style.display = kategori === 'all' || quest.dataset.kategori === kategori ? '' : 'none';
    });
    document.querySelectorAll('.tombol-filter').forEach((item) => item.classList.remove('aktif'));
    tombol?.classList.add('aktif');
}

function bukaModalProyek(judul, deskripsi, tags, status) {
    document.getElementById('modal-judul').textContent = judul;
    document.getElementById('modal-deskripsi').textContent = deskripsi;
    document.getElementById('modal-status').textContent = status;
    const wadahTags = document.getElementById('modal-tags');
    wadahTags.replaceChildren(...tags.map((tag) => {
        const label = document.createElement('span');
        label.className = 'label-teknologi';
        label.textContent = tag;
        return label;
    }));
    document.getElementById('modal-proyek').classList.add('aktif');
}

function tutupModalProyek() {
    document.getElementById('modal-proyek').classList.remove('aktif');
}

function bukaDemoKalkulator() {
    document.getElementById('modal-kalkulator').classList.add('aktif');
}

function tutupDemoKalkulator() {
    document.getElementById('modal-kalkulator').classList.remove('aktif');
}

function tambahInputKalkulator(nilai) {
    const display = document.getElementById('calc-display');
    if (kalkulatorBaru && /[0-9.]/.test(nilai)) {
        display.value = nilai === '.' ? '0.' : nilai;
        kalkulatorBaru = false;
        return;
    }
    display.value = display.value === '0' && /[0-9]/.test(nilai) ? nilai : display.value + nilai;
    kalkulatorBaru = false;
}

function hapusKalkulator() {
    document.getElementById('calc-display').value = '0';
    document.getElementById('calc-history').textContent = 'Calculated result:';
    kalkulatorBaru = true;
}

function backspaceKalkulator() {
    const display = document.getElementById('calc-display');
    display.value = display.value.length > 1 ? display.value.slice(0, -1) : '0';
}

function hitungKalkulator() {
    const display = document.getElementById('calc-display');
    const history = document.getElementById('calc-history');
    const ekspresi = display.value;
    if (!/^[0-9+*/%.()\s-]+$/.test(ekspresi)) {
        history.textContent = 'Invalid expression';
        kalkulatorBaru = true;
        return;
    }
    try {
        const hasil = Function(`"use strict"; return (${ekspresi})`)();
        if (!Number.isFinite(hasil)) throw new Error('Invalid result');
        history.textContent = `${ekspresi} =`;
        display.value = String(hasil);
    } catch {
        history.textContent = 'Invalid calculation';
        display.value = '0';
    }
    kalkulatorBaru = true;
}

function keAtasHalaman() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const tombol = document.getElementById('tombol-scroll-atas');
    if (tombol) tombol.style.display = window.scrollY > 300 ? 'inline-block' : 'none';
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        tutupModalProyek();
        tutupDemoKalkulator();
    }
});

window.setInterval(picuSeranganHero, 1200);
