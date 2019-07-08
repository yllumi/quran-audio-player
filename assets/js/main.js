let state = 'stop'; // play, pause
let loop = 0;
let surat = 1;
let ayat = 1;

let startSurat = 1;
let endSurat = 1;
let startAyat = 1;
let endAyat = 7;

let listJuz;
let listSurat;

var song;
let btnPlay = document.getElementById('play');
let btnStop = document.getElementById('stop');

let btnShowForm = document.getElementById('showForm');
let btnCloseForm = document.querySelectorAll('.closeForm');

let selectJuz = document.getElementById('setJuz');
let selectSurat = document.getElementById('setSurat');
let selectHalamanAwal = document.getElementById('setHalamanAwal');
let selectHalamanAkhir = document.getElementById('setHalamanAkhir');
let selectSuratAwal = document.getElementById('setSuratAwal');
let selectSuratAkhir = document.getElementById('setSuratAkhir');
let selectAyatAwal = document.getElementById('setAyatAwal');
let selectAyatAkhir = document.getElementById('setAyatAkhir');

let textCurrentSurat = document.getElementById('currentSurat');
let textCurrentAyat = document.getElementById('currentAyat');

document.addEventListener('DOMContentLoaded', function()
{
    var tabElms = document.querySelectorAll('.tabs');
    var tabInstance = M.Tabs.init(tabElms);

    // Generate dropdown surat
    listJuz = [];
    fetch('data/juz.json')
       .then(response => response.json())
       .then(json => {
           listJuz = json;
           for (var i = 0; i < listJuz.length; i++) {
               var option = document.createElement("option");
               option.value = i+1;
               option.text = listJuz[i].name;
               selectJuz.appendChild(option);
           }
           var selectJuzIns = M.FormSelect.init(selectJuz);
       })
       .catch(error => {
           console.log('Failed')
       })

    // Generate dropdown surat
    listSurat = [];
    fetch('data/surat.json')
       .then(response => response.json())
       .then(json => {
           listSurat = json;
           for (var i = 0; i < listSurat.length; i++) {
               var option = document.createElement("option");
               option.value = i+1;
               option.text = i+1 + " - " + listSurat[i].name;
               selectSurat.appendChild(option);
               var cln = option.cloneNode(true);
               selectSuratAwal.appendChild(cln);
               var cln = option.cloneNode(true);
               selectSuratAkhir.appendChild(cln);
           }
           var selectSuratIns = M.FormSelect.init(selectSurat);
           var selectSuratAwalIns = M.FormSelect.init(selectSuratAwal);
           var selectSuratAkhirIns = M.FormSelect.init(selectSuratAkhir);
       })
       .catch(error => {
           console.log('Failed')
       })

    // Generate dropdown halaman
    for (var i = 1; i <= 604; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        selectHalamanAwal.appendChild(option);
        var cln = option.cloneNode(true);
        selectHalamanAkhir.appendChild(cln);
    }
    var selectHalamanAwalIns = M.FormSelect.init(selectHalamanAwal);
    var selectHalamanAkhirIns = M.FormSelect.init(selectHalamanAkhir);

    // Generate dropdown ayat
    for (var i = 1; i <= 7; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        selectAyatAwal.appendChild(option);
        var cln = option.cloneNode(true);
        selectAyatAkhir.appendChild(cln);
    }
    var selectAyatAwalIns = M.FormSelect.init(selectAyatAwal);
    var selectAyatAkhirIns = M.FormSelect.init(selectAyatAkhir);
});

btnPlay.onclick = () => {
    if(state == 'stop'){ // begin play
        startSurat = selectSuratAwal.value;
        startAyat = selectAyatAwal.value;
        endSurat = selectSuratAkhir.value;
        endAyat = selectAyatAkhir.value;

        surat = startSurat;
        ayat = startAyat;
        console.log(startSurat,startAyat,endSurat,endAyat,surat,ayat);
        initAudio();

        state = 'play';
        btnStop.classList.remove('disabled');
        btnPlay.innerHTML = '<i class="icon-pause"></i>';
    } else if(state == 'play'){ // pause
        song.pause();
        state = 'pause';
        btnPlay.innerHTML = '<i class="icon-play"></i>';
    } else { // play from pause
        song.play();
        state = 'play';
        btnPlay.innerHTML = '<i class="icon-pause"></i>';
    }
}

btnStop.onclick = () => {
    ayat = 1;
    state = 'stop';
    btnStop.classList.add('disabled');
    btnPlay.innerHTML = '<i class="icon-play"></i>';
    song.pause();
}

function initAudio()
{
    song = new Audio('audio/' + surat + '/' + ayat + '.mp3');
    song.onended = () => {
        ayat++;
        if(ayat > endAyat){
            if(surat < endSurat){
                surat++;
                ayat = 1;
            }
        }

        initAudio();
    }
    song.onerror = () => {
        surat++;
        ayat = 1;
        initAudio();
    }
    updateCurrentCaption();
    song.play();
}

function updateCurrentCaption()
{
    let currentSurat = listSurat[parseInt(surat)-1].name;
    textCurrentSurat.innerHTML = currentSurat;
    textCurrentAyat.innerHTML = ayat;
}

btnShowForm.onclick = () => {
    document.getElementById('sideform').classList.remove('closed')
}

btnCloseForm.forEach(function(elm){
    elm.addEventListener('click', () => {
        document.getElementById('sideform').classList.add('closed')
    })
})

selectSuratAwal.onchange = () => {
    while (selectAyatAwal.firstChild) {
        selectAyatAwal.removeChild(selectAyatAwal.firstChild);
    }
    let totalAyat = listSurat[parseInt(selectSuratAwal.value) - 1].ayat;
    for (var i = 1; i <= totalAyat; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        selectAyatAwal.appendChild(option);
    }
    var selectAyatAwalIns = M.FormSelect.init(selectAyatAwal);
}

selectSuratAkhir.onchange = () => {
    while (selectAyatAkhir.firstChild) {
        selectAyatAkhir.removeChild(selectAyatAkhir.firstChild);
    }
    let totalAyat = listSurat[parseInt(selectSuratAkhir.value) - 1].ayat;
    for (var i = 1; i <= totalAyat; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        selectAyatAkhir.appendChild(option);
    }
    var selectAyatAkhirIns = M.FormSelect.init(selectAyatAkhir);
}

selectHalamanAwal.onchange = () => {
    if(parseInt(selectHalamanAwal.value) > parseInt(selectHalamanAkhir.value)){
        selectHalamanAkhir.selectedIndex = parseInt(selectHalamanAwal.value) -1;
        selectHalamanAkhirIns = M.FormSelect.init(selectHalamanAkhir);
    }
}