//! GLOBAL VARIABLES
const bgImgURLInput = document.querySelector('#bg-img-url-input');
const bgImgRepeatChk = document.querySelector('#bg-img-repeat-chk');
const bsModal = new bootstrap.Modal(document.getElementById('modal'));
const chart = document.querySelector('#chart');
const chartTitleDiv = document.querySelector('#chart-title');
const chartTitleInput = document.querySelector('#chart-title-input');
const chartCovers = document.querySelector('#chart-covers');
const colMinusBtn = document.querySelector('#col-num-btn-minus');
const colNumInput = document.querySelector('#col-num');
const colPlusBtn = document.querySelector('#col-num-btn-plus');
const colNumSpan = document.querySelector('#chart-size-col');
const downloadJPGBtn = document.querySelector('#download-jpg-btn');
const exportJSONBtn = document.querySelector('#export-json-btn');
const importJSONBtn = document.querySelector('#import-json-btn');
const importJSONInput = document.querySelector('#import-json-input');
const resetBtn = document.querySelector('#reset-btn');
const gutterSlider = document.querySelector('#gutter');
const imgSizeSlider = document.querySelector('#img-size');
const lastfmAPIKey = "fc796a0c61cb69cccbaccb4706b597e4";
const modal = document.querySelector('#modal');
const modalSearchbar = document.querySelector('#modal-searchbar');
const modalSearchBtn = document.querySelector('#modal-search-btn');
const modalGrid = document.querySelector('#modal-grid');
const modalNoAlbums = document.querySelector('#modal-no-albums');
const optionsContainer = document.querySelector('#options-container');
const placeholderImg = "./img/placeholder.jpg";
const rankSwitch = document.querySelector('#rank-switch');
const root = document.documentElement; //to manage CSS variables
const rowMinusBtn = document.querySelector('#row-num-btn-minus');
const rowNumInput = document.querySelector('#row-num');
const rowPlusBtn = document.querySelector('#row-num-btn-plus');
const rowNumSpan = document.querySelector('#chart-size-row');
const sideTitles = document.querySelector('#side-titles');
const titleSwitch = document.querySelector('#title-switch');
const titlePositionOptions = document.querySelector('#title-position-options'); //div that contains the two radio
const titlePositionBelowRadio = document.querySelector('#title-below-radio');
const titlePositionSideRadio = document.querySelector('#title-side-radio');


let colNum, rowNum, imgSize, gutter, paddingTopSideTitles;
let rank = 1;
let lastGridClickedImg; //contains the last clicked image that triggers the modal to open

//! EVENT LISTENERS

//# INPUT EVENT
optionsContainer.addEventListener('input', e => {
  const elem = e.target;
  //img size range
  if (elem === imgSizeSlider) {
    options.setImgSize(elem.value);
    options.setImgSizeSpanText();
    ls.set('imgSize', elem.value);
  }
  //gutter range
  if (elem === gutterSlider) {
    options.setGutter(elem.value);
    options.setGutterSpanText();
    ls.set('gutter', elem.value);
  }
  //bg img url input
  if (elem === bgImgURLInput) {
    options.setBgImage(elem.value);
    ls.set('bgImgURL', elem.value);
  }
  //repeat bg checkbox
  if (elem === bgImgRepeatChk) {
    options.repeatBgImage();
    ls.set('bgImgRepeat', elem.checked);
  }
  //title input
  if (elem === chartTitleInput) {
    options.setChartTitle(elem.value);
    ls.set('chartTitle', elem.value);
  }
  //rank
  if (elem === rankSwitch) {
    options.showHideRanks(rankSwitch);
    ls.set('showRanks', elem.checked);
  }
  //title
  if (elem === titleSwitch) {
    options.showHideTitlesPositionOptions(titleSwitch);
    ls.set('showTitles', elem.checked);
  }
});

//# CLICK EVENT
optionsContainer.addEventListener('click', e => {
  const elem = e.target;
  
  //rownum++
  if (elem === rowPlusBtn) {
    general.setCSSVar('rowNum', ++rowNum);
    chartFuncs.addCells(colNum);
    chartFuncs.addTitlesSide(colNum);
  }
  //rownum--
  if (elem === rowMinusBtn) {
    if (rowNum != 1) {
      general.setCSSVar('rowNum', --rowNum);
      chartFuncs.removeCells(colNum);
      //remove the last row of titles
      sideTitles.removeChild(sideTitles.lastChild)
    }
  }
  //colnum++
  if (elem === colPlusBtn) {
    general.setCSSVar('colNum', ++colNum);
    chartFuncs.addCells(rowNum);
    chartFuncs.addTitlesSide(colNum, rowNum);
  }
  //colnum--
  if (elem === colMinusBtn) {
    if (colNum != 1) {
      general.setCSSVar('colNum', --colNum);
      chartFuncs.removeCells(rowNum);
      // the add function will remove every previous title and re-build the list
      chartFuncs.addTitlesSide(colNum, rowNum);
    }
  }
  //col +/- or row +/-
  if (elem === colMinusBtn || elem === colPlusBtn || elem === rowMinusBtn || elem === rowPlusBtn) {
    ls.set('colNum', colNum);
    ls.set('rowNum', rowNum);
    chartFuncs.saveGridInfo();
    options.setSpanText();
  }
  //rank
  if (elem === rankSwitch) {
    options.showHideRanks();
    chartFuncs.verticalCenterSideTitles();
  };
  //title
  if (elem === titleSwitch) {
    options.showHideTitlesPositionOptions();
  };
  //radio for title position 
  if (elem === titlePositionBelowRadio || elem === titlePositionSideRadio) {
    //set the 
    if (elem === titlePositionBelowRadio) {
      ls.set('showTitlesBelow', true);
      ls.set('showTitlesSide', false);
    }
    if (elem === titlePositionSideRadio) {
      ls.set('showTitlesSide', true);
      ls.set('showTitlesBelow', false);
    }
    options.showHideTitles();
  }
  //download JPG button
  if (elem === downloadJPGBtn) {
    buttons.downloadChartAsJPG();
  }
  //export JSON button
  if (elem === exportJSONBtn) {
    buttons.exportChartAsJSON();
  }
  //import JSON button
  if (elem === importJSONBtn) {
    buttons.importChartFromJSON();
  }
  //reset btn
  if (elem === resetBtn) {
    buttons.reset();
  }
});

//# DRAG&DROP EVENTS
//the user starts dragging an item
chart.addEventListener("dragstart", e => {  
  const sourceElem = e.target;
  if (sourceElem.matches('img.cc-coverpic')) { e.dataTransfer.setData('text/plain', sourceElem.id); } //! important difference between event and sourceElem
})

//the dragged item is being dragged over a valid drop target
chart.addEventListener("dragover", e => { 
  const destElem = e.target;
  if (destElem.matches('img.cc-coverpic')) {
    e.preventDefault();  //necessary to allow the user to later drop the element on the target
  }
})

//the dragged item is dropped over a valid drop target
chart.addEventListener("drop", e => { 
  const destElem = e.target;
  const sourceElemId = e.dataTransfer.getData('text/plain');
  const sourceElem = document.getElementById(sourceElemId);

  if (destElem.matches('img.cc-coverpic') && destElem != sourceElem) {
    e.preventDefault(); //necessary to allow the user to drop the element on the target
    //! swap the info of the elements in 3 steps
    //1/3 save dest elem info in a temp elem
    const tmp = document.createElement('div');
    tmp.dataset.artist = destElem.dataset.artist; 
    tmp.dataset.album = destElem.dataset.album;
    tmp.src = destElem.src;
    //2/3 copy source elem info to dest elem
    destElem.dataset.artist = sourceElem.dataset.artist;
    destElem.dataset.album = sourceElem.dataset.album;
    destElem.src = sourceElem.src;
    //3/3 copy tmp elem (holding dest elem info) to source elem
    sourceElem.dataset.artist = tmp.dataset.artist;
    sourceElem.dataset.album = tmp.dataset.album;
    sourceElem.src = tmp.src;
    //! update title below
    const destElemSibling = destElem.nextElementSibling;
    destElemSibling.innerText = `${destElem.dataset.artist}\n${destElem.dataset.album}`;
    const sourceElemSibling = sourceElem.nextElementSibling;
    sourceElemSibling.innerText = `${sourceElem.dataset.artist}\n${sourceElem.dataset.album}`;
    //! update title on side and info in localStorage
    chartFuncs.addTitlesSide(colNum, rowNum);
    chartFuncs.saveGridInfo();
  } 
})

//# MODAL EVENTS
modal.addEventListener("shown.bs.modal", (e) => {
  lastGridClickedImg = e.relatedTarget;
  modalSearchbar.focus(); //focus on search bar when modal is shown
})

modalSearchBtn.addEventListener("click", () => {
  lastfm.searchAlbum();
});

modalSearchbar.addEventListener("keyup", e => {
  if (e.keyCode == 13) {
    e.preventDefault();
    lastfm.searchAlbum();
  }
});

modalGrid.addEventListener("click", e => {
  const elem = e.target;
  if (elem.matches('.modal-cell>img')) {
    lastGridClickedImg.src = elem.src;
    lastGridClickedImg.dataset.artist = elem.dataset.artist;
    lastGridClickedImg.dataset.album = elem.dataset.album;
    lastGridClickedImg.nextElementSibling.innerText = `${elem.dataset.artist}\n${elem.dataset.album}`; //update description below
    chartFuncs.addTitlesSide(colNum, rowNum); //update description on side
    chartFuncs.saveGridInfo();
    bsModal.hide();
  }
})

//! FUNCTIONS
//# LOCALSTORAGE MANAGER
const ls = {
  set(key, val) {
    window.localStorage.setItem(key, val);
  },

  get(key) {
    return window.localStorage.getItem(key);
  },

  clear() {
    window.localStorage.clear();
  }
}

//# BUTTONS
const buttons = {
  downloadChartAsJPG() {
    const width = chart.getBoundingClientRect().width;
    const height = chart.getBoundingClientRect().height;
    //console.log(width, height);

    domtoimage.toJpeg(document.getElementById('chart'), { quality: 1, width: width, height: height })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${new Date().toISOString()}`;
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  },

  exportChartAsJSON() {
    const data = ls.get('grid');
    if (data !== null) {
      const filename = `${new Date().toISOString()}.json`;
      const file = new Blob([data], {
        type: 'application/json',
        name: filename
      });
      saveAs(file,filename);
    }
  },

  importChartFromJSON() {
    importJSONInput.click();
    
    // try {
    //   JSON.parse(chartJSON);
    // } catch (e) {
    //   alert('The provided file isn\' in a valid JSON format');
    //   return;
    // }
    // ls.set('grid',chartJSON);
    // location.reload();
  },

  reset() {
    if (confirm('Are you sure? This will delete all the albums and saved options.')) {
      ls.clear();
      location.reload();
    }
  }

}

//# OPTIONS
const options = {
  setBgColor() {
    chart.style.backgroundColor = this.toHEXString();
    ls.set('bgColor', this.toHEXString());
  },

  setBgImage(url) {
    chart.style.backgroundImage = `url(${url})`;
  },

  setChartTitle(title) {
    chartTitleDiv.textContent = title;
  },

  setGutter(gutter) {
    general.setCSSVarPx('gutter',gutter);
  },

  setGutterSpanText() {
    document.querySelector('#gutter-span').textContent = gutterSlider.value;
  },

  setImgSize(imgSize) {
    general.setCSSVarPx('imgSize',imgSize);
  },

  setImgSizeSpanText() {
    document.querySelector('#img-size-span').textContent = imgSizeSlider.value;
  },
  
  setTextColor() {
    chart.style.color = this.toHEXString();
    ls.set('textColor', this.toHEXString());
  },

  setSpanText() {
    rowNumSpan.textContent = rowNum;
    colNumSpan.textContent = colNum;
  },

  repeatBgImage() {
    chart.classList.toggle('repeat-bg');
  },

  showHideRanks() {
    const ranks = document.querySelectorAll('.cc-rank');
    rankSwitch.checked ? ranks.forEach(el => el.classList.remove('d-none')) : ranks.forEach(el => el.classList.add('d-none'));
  },

  showHideTitles() {
    const titles = document.querySelectorAll('.cc-title, .side-title-cell');
    for (const title of titles) {
      title.classList.add('d-none'); //hide all titles
      //if show title option is not set, continue
      if (!titleSwitch.checked) { 
        continue; 
      }
      //otherwise show titles below/on side based on radio
      if (title.classList.contains('cc-title') && titlePositionBelowRadio.checked || title.classList.contains('side-title-cell') && titlePositionSideRadio.checked) {
          title.classList.toggle('d-none');
      }
    }
  },

  //show/hide title position div and titles below/on side based on radio
  showHideTitlesPositionOptions() {
    titleSwitch.checked ? titlePositionOptions.classList.remove('d-none') : titlePositionOptions.classList.add('d-none');
    this.showHideTitles();
  }
}

//# CHART
const chartFuncs = {
  generateInitialGrid()  {
    //second parameter tells the function it's been called for the first time
    this.addCells(colNum*rowNum, true);
    this.addTitlesSide(colNum,rowNum);
  },

  addCells(cellsToAdd, generateGrid = false) {
    for (let i = 1; i<=cellsToAdd; i++) {
      //# CHART CELL
      const chartCell = document.createElement('div');
      chartCell.classList.add('chart-cell');

      //# RANK
      const cellRank = document.createElement('div');
      cellRank.classList.add('cc-rank','text-center');
      //keep the correct class when adding/removing columns
      rankSwitch.checked ? cellRank.classList.remove('d-none') : cellRank.classList.add('d-none');
      cellRank.textContent = `#${rank}`;

      //# COVER
      const cellCover = document.createElement('img');
      cellCover.id = `cover-${rank}`
      cellCover.classList.add('cc-coverpic');
      cellCover.alt = "Album art";
      if (ls.get('grid') && generateGrid) {
        let obj = JSON.parse(ls.get('grid'));
        cellCover.src = obj[i].src;
        cellCover.dataset.artist = obj[i].artist;
        cellCover.dataset.album = obj[i].album;
      }
      else {
        cellCover.src = placeholderImg;
        cellCover.dataset.artist = "Artist";
        cellCover.dataset.album = "Album";
      }
      cellCover.dataset.bsToggle = "modal";
      cellCover.dataset.bsTarget = "#modal";
      cellCover.draggable = true; 

      //# TITLE BELOW
      const cellTitle = document.createElement('div');
      cellTitle.classList.add('cc-title','text-center');
      if (titleSwitch.checked && !titlePositionBelowRadio.checked || !titleSwitch.checked) {
        cellTitle.classList.add('d-none')
      }
      
      cellTitle.innerText = `${cellCover.dataset.artist}\n${cellCover.dataset.album}`;
      
      //# UPDATE RANK
      rank++;

      //# APPEND
      chartCell.appendChild(cellRank);
      chartCell.appendChild(cellCover);
      chartCell.appendChild(cellTitle);
      chartCovers.appendChild(chartCell);
    }
  },

  addTitlesSide(colNum = 0, rowNum = 0) {
    let count;
    if (rowNum != 0 && colNum != 0) {
      //! clear current titles
      sideTitles.replaceChildren();
      //! add titles
      count = 1;
      // for every row...
      for (let i = 1; i <= rowNum; i++) {
        //... add the div that will contain the divs containing the titles
        const sideTitleCell = document.createElement('div');
        sideTitleCell.classList.add('side-title-cell');
        if (titleSwitch.checked && !titlePositionSideRadio.checked || !titleSwitch.checked) {
          sideTitleCell.classList.add('d-none')
        }
        for (let j = 1; j <= colNum; j++) {
          // get the img that contains the data attributes for Artist and Album
          const ccCover = document.querySelector(`#cover-${count}`);
          // format values as "Artist - Album"
          const sideTitleString = `${ccCover.dataset.artist} - ${ccCover.dataset.album}`;
          // add the info inside a div
          const sideTitleCellContent = document.createElement('div');
          sideTitleCellContent.textContent = sideTitleString;
          sideTitleCell.appendChild(sideTitleCellContent);
          count++;
        }
        sideTitles.appendChild(sideTitleCell);
      }
    }

    //! adding a new row
    if (colNum != 0 && rowNum == 0) {
      // rank was updated (increased of colNum) by the addCells -> restore its value
      count = rank-colNum;
      const sideTitleCell = document.createElement('div');
      sideTitleCell.classList.add('side-title-cell', 'bordered', 'CornflowerBlue');
      if (titleSwitch.checked && !titlePositionSideRadio.checked || !titleSwitch.checked) {
        sideTitleCell.classList.add('d-none')
      }
      for(let i = 1; i <= colNum; i++) {
        // get the img that contains the data attributes for Artist and Album
        const ccCover = document.querySelector(`#cover-${count}`);
        // format values as "Artist - Album"
        const sideTitleString = `${ccCover.dataset.artist}${count} - ${ccCover.dataset.album}${count}`;
        // add the info inside a div
        const sideTitleCellContent = document.createElement('div');
        sideTitleCellContent.textContent = sideTitleString;
        sideTitleCell.appendChild(sideTitleCellContent);
        count++;
      }
      sideTitles.appendChild(sideTitleCell);
    }
  },

  removeCells(cellsToRemove)  {
    for (let i = 1; i<=cellsToRemove; i++) {
      chartCovers.removeChild(chartCovers.lastChild);
      rank--;
    }
  },

  saveGridInfo() {
    const coverList = chartCovers.querySelectorAll('.cc-coverpic');
    let obj = {};
    let idx = 1;
    coverList.forEach(el => {
      obj[idx] = {
        src: el.src,
        artist: el.dataset.artist,
        album: el.dataset.album,
      }
      idx++;
    });
    ls.set('grid',JSON.stringify(obj))
  },

  //dinamically set the paddingTopSideTitles to vertically center the titles on the side with the image
  verticalCenterSideTitles () {
    //get the line height of body
    const lineHeight = Number(window.getComputedStyle(document.body).getPropertyValue('line-height').match(/\d+/)[0]);
    const paddingTopSideTitles = rankSwitch.checked ? lineHeight : 0 ;
    general.setCSSVarPx('paddingTopSideTitles', paddingTopSideTitles);
  }
}

//# COLORPICKER
//shared across all pickers
jscolor.presets.default = {
  alphaChannel: false,
  backgroundColor: '#000', //picker's bg color
  padding: 0
};

const bgColorPicker = new JSColor('#bg-color-btn', {
  value: ls.get('bgColor') || '#000',
  onInput: options.setBgColor
});

const textColorPicker = new JSColor('#text-color-btn', {
  value: ls.get('textColor') || '#fff',
  onInput: options.setTextColor
});

//# GENERAL
const general = {
  getCSSVarValue(cssvar) {
    return parseInt(getComputedStyle(root).getPropertyValue(`--${cssvar}`));
  },

  setCSSVarPx(cssvar, jsvar) {
    root.style.setProperty(`--${cssvar}`, `${jsvar}px`);
  },

  setCSSVar(cssvar, jsvar) {
    root.style.setProperty(`--${cssvar}`, jsvar);
  },

  //set all the options values, first in JS and then in CSS variables
  setInitialValues() {
    //! background URL input
    bgImgURLInput.value = ls.get('bgImgURL') || '';
    if (bgImgURLInput.value) { //both undefined and '' evaluates to false
      options.setBgImage(bgImgURLInput.value);
    }
    //! repeat background chk
    bgImgRepeatChk.checked = ls.get('bgImgRepeat') == 'true' ? true : false;
    if (bgImgRepeatChk.checked) {
      options.repeatBgImage();
    }
    //! bg and text color
    if (ls.get('bgColor')) {
      chart.style.backgroundColor = ls.get('bgColor');
    }
    if (ls.get('textColor')) {
      chart.style.color = ls.get('textColor');
    }
    //! col and row number
    colNum = ls.get('colNum') || colNumInput.dataset.value;
    rowNum = ls.get('rowNum') || rowNumInput.dataset.value;
    //! imgSize
    if (ls.get('imgSize')) {
      imgSizeSlider.value = ls.get('imgSize');
    }
    imgSize = imgSizeSlider.value;
    options.setImgSizeSpanText();
    //! gutter
    if (ls.get('imgSize')) {
      gutterSlider.value = ls.get('gutter');
    }
    gutter = gutterSlider.value;
    options.setGutterSpanText();
    //! chart title
    if (ls.get('chartTitle')) {
      chartTitleInput.value = ls.get('chartTitle');
      chartTitleDiv.textContent = ls.get('chartTitle');
    }
    //! show ranks chk
    rankSwitch.checked = ls.get('showRanks') == 'true' ? true : false;
    if (rankSwitch.checked) {
      options.showHideRanks(rankSwitch);
    }
    //! show titles
    titleSwitch.checked = ls.get('showTitles') == 'true' ? true : false;
    if (ls.get('showTitlesSide') === null || ls.get('showTitlesSide') == 'false') {
      titlePositionBelowRadio.checked = true;
    }
    else {
      titlePositionSideRadio.checked = true;
    }


    //CSS
    this.setCSSVar('colNum',colNum);
    this.setCSSVar('rowNum',rowNum);
    this.setCSSVarPx('imgSize',imgSize);
    this.setCSSVarPx('gutter',gutter);
  },
};

const maxModalCells = general.getCSSVarValue('maxModalCells');

//# LASTFM
const lastfm = {
  searchAlbum() {
    const searchTerm = modalSearchbar.value;
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchTerm}&api_key=${lastfmAPIKey}&limit=100&format=json`;

    fetch(url)
      .then(response => response.json()) //extract JSON content from HTTP response received by the promise
      .then(data => { //data is the parsed JSON
        const albumsArray = data.results.albummatches.album;
        modalGrid.replaceChildren(); //clean grid

        //cycle all the results
        for (const album of albumsArray) {
          //stop when 16 elements have been added
          if (modalGrid.children.length >= maxModalCells) {
            break;
          }

          const imgUrl = album.image[album.image.length - 1]['#text']; //get the biggest lastFM pic
          if (!imgUrl) { 
            continue
          }

          //wrapper div
          const modalCell = Object.assign(document.createElement('div'), {
            className : "modal-cell"
          });
          //description displayed on hover
          const modalCellDescription = Object.assign(document.createElement('div'), {
            textContent: `${album.artist}\n${album.name}`,
            className: "modal-cell-description"
          });
          //img with various info
          const modalCellImg = Object.assign(document.createElement('img'), {
            src: imgUrl,
            width: 100,
          });
          //no way of adding dataset stuff via Object.assign
          modalCellImg.dataset.artist = album.artist;
          modalCellImg.dataset.album = album.name;

          //appending operations
          modalCell.append(modalCellImg, modalCellDescription);
          modalGrid.append(modalCell);
        }

        //show grid or "error" message based no how many albums with cover were found
        if(modalGrid.children.length) {
          modalNoAlbums.classList.add('d-none');
          modalGrid.classList.remove('d-none');
        }
        else {
          modalGrid.classList.add('d-none');
          modalNoAlbums.classList.remove('d-none');
        }
      });
  },
}


//!  FUNCTION CALLS
general.setInitialValues();
chartFuncs.generateInitialGrid();
chartFuncs.verticalCenterSideTitles();
options.showHideRanks();
options.showHideTitlesPositionOptions();
options.setSpanText();