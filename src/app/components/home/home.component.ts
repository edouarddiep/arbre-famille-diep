import { Component, OnInit } from '@angular/core';
import { Howl, Howler } from 'howler';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mainSong = new Howl({
    src: ['assets/sounds/dance_me_to_the_end_of_love.mp3'], html5: true, loop: true
  });

  mamanSong = new Howl({
    src: ['assets/sounds/non_je_ne_regrette_rien.mp3'], html5: true, loop: true
  });

  ericSong = new Howl({
    src: ['assets/sounds/asimbonanga.mp3'], html5: true, loop: true
  });

  edouardSong = new Howl({
    src: ['assets/sounds/kokiri_forest.mp3'], html5: true, loop: true
  });

  mamanLySong = new Howl({
    src: ['assets/sounds/vietnamese_music1.mp3'], html5: true, loop: true
  });

  papaAnSong = new Howl({
    src: ['assets/sounds/petit_papa_noel.mp3'], html5: true, loop: true
  });

  binhSong = new Howl({
    src: ['assets/sounds/kung_fu_fighting.mp3'], html5: true, loop: true
  });

  kimSong = new Howl({
    src: ['assets/sounds/vietnamese_music2.mp3'], html5: true, loop: true
  });

  lauraSong = new Howl({
    src: ['assets/sounds/rendez_vous_dans_10_ans.mp3'], html5: true, loop: true
  });

  yayaSong = new Howl({
    src: ['assets/sounds/cheval_de_bois_adult.mp3'], html5: true, loop: true
  });

  papouSong = new Howl({
    src: ['assets/sounds/to_gelakaki.mp3'], html5: true, loop: true
  });

  linhSong = new Howl({
    src: ['assets/sounds/let_it_be_beatles.mp3'], html5: true, loop: true
  });

  namSong = new Howl({
    src: ['assets/sounds/mysterieuses_cites_dor.mp3'], html5: true, loop: true
  });

  loanSong = new Howl({
    src: ['assets/sounds/dragon_ball_z.mp3'], html5: true, loop: true
  });

  taoSong = new Howl({
    src: ['assets/sounds/tao_tao.mp3'], html5: true, loop: true
  });

  ericAge = this.getAge('12/29/1982'); // 29 décembre 1982
  edouardAge = this.getAge('04/28/1994'); // 28 avril 1994
  lauraAge = this.getAge('04/27/1979'); // 27 avril 1979
  tinaAge = this.getAge('07/24/1954'); // 24 juillet 1954
  binhAge = this.getAge('07/13/1953'); // 13 juillet 1953
  linhAge = this.getAge('02/21/2003'); // 21 février 2003
  namAge = this.getAge('06/21/2004'); // 21 juin 2004
  loanAge = this.getAge('05/13/2006'); // 13 mai 2006
  taoAge = this.getAge('06/11/2010'); // 11 juin 2010
  kimAge = this.getAge('12/04/2003'); // 4 décembre 2003

  constructor(public dialog: MatDialog) { }


  ngOnInit() {
    // Set starter animations.
    setTimeout(() => {
      document.getElementById("homeTitle").className = "home-title-show";
    }, 2000);
    setTimeout(() => {
      document.getElementById("homeDate").className = "home-date-show";
    }, 500);
    setTimeout(() => {
      document.getElementById("tree").className = "tree";
    }, 100);

    // Play main's song.
    this.mainSong.seek(.4);
    this.mainSong.play();
    // Change global volume.
    Howler.volume(0.5);
    localStorage.setItem('ericAge', this.ericAge.toString());
    localStorage.setItem('edouardAge', this.edouardAge.toString());
    localStorage.setItem('lauraAge', this.lauraAge.toString());
    localStorage.setItem('tinaAge', this.tinaAge.toString());
    localStorage.setItem('binhAge', this.binhAge.toString());
    localStorage.setItem('linhAge', this.linhAge.toString());
    localStorage.setItem('namAge', this.namAge.toString());
    localStorage.setItem('loanAge', this.loanAge.toString());
    localStorage.setItem('taoAge', this.taoAge.toString());
    localStorage.setItem('kimAge', this.kimAge.toString());
  }

  getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    const month = today.getMonth() - birthDate.getMonth();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  openDialog(e) {
    e.preventDefault();
    const id = e.target.id;
    let dialogRef;
    switch (id) {
      case "eric":
        dialogRef = this.dialog.open(HomeDialogEric, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.ericSong.seek(1);
        this.ericSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.ericSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "edouard":
        dialogRef = this.dialog.open(HomeDialogEdouard, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.edouardSong.seek(5.5);
        this.edouardSong.play();
        dialogRef.afterOpened().subscribe(() => {
          console.log(dialogRef._containerInstance._config.panelClass = 'custom-modalbox-show');
        });
        dialogRef.afterClosed().subscribe(() => {
          this.edouardSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "laura":
        dialogRef = this.dialog.open(HomeDialogLaura, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.lauraSong.seek(.4);
        this.lauraSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.lauraSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "binh":
        dialogRef = this.dialog.open(HomeDialogBinh, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.binhSong.seek(12.5);
        this.binhSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.binhSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "tina":
        dialogRef = this.dialog.open(HomeDialogMaman, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.mamanSong.seek(.5);
        this.mamanSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.mamanSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "yaya":
        dialogRef = this.dialog.open(HomeDialogYaya, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.yayaSong.seek(12);
        this.yayaSong.volume(0.3);
        this.yayaSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.yayaSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "papou":
        dialogRef = this.dialog.open(HomeDialogPapou, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.papouSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.papouSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "kim":
        dialogRef = this.dialog.open(HomeDialogKim, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.kimSong.seek(2);
        this.kimSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.kimSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "linh":
        dialogRef = this.dialog.open(HomeDialogLinh, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.linhSong.seek(10);
        this.linhSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.linhSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "nam":
        dialogRef = this.dialog.open(HomeDialogNam, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.namSong.seek(48);
        this.namSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.namSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "loan":
        dialogRef = this.dialog.open(HomeDialogLoan, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.loanSong.seek(4);
        this.loanSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.loanSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "tao":
        dialogRef = this.dialog.open(HomeDialogTao, {
          panelClass: 'custom-modalbox',
        });
        this.mainSong.mute(true);
        this.taoSong.seek(1);
        this.taoSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.taoSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "mamanLy":
        dialogRef = this.dialog.open(HomeDialogMamanLy, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.mamanLySong.seek(11);
        this.mamanLySong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.mamanLySong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "papaAn":
        dialogRef = this.dialog.open(HomeDialogPapaAn, {
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.papaAnSong.seek(25);
        this.papaAnSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.papaAnSong.stop();
          this.mainSong.mute(false);
        });
        break;
      default:
        break;
    }
  }
}

@Component({
  selector: 'home-dialog-eric',
  templateUrl: 'home-dialog-eric.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogEric {
  /* L'âge s'actualise chaque année */
  age = localStorage.getItem('ericAge');
}

@Component({
  selector: 'home-dialog-edouard',
  templateUrl: 'home-dialog-edouard.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogEdouard {
  /* L'âge s'actualise chaque année */
  age = localStorage.getItem('edouardAge');
}

@Component({
  selector: 'home-dialog-laura',
  templateUrl: 'home-dialog-laura.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogLaura {
  /* L'âge s'actualise chaque année */
  age = localStorage.getItem('lauraAge');
}

@Component({
  selector: 'home-dialog-maman',
  templateUrl: 'home-dialog-maman.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogMaman {
  /* L'âge s'actualise chaque année */
  age = localStorage.getItem('tinaAge');
}

@Component({
  selector: 'home-dialog-binh',
  templateUrl: 'home-dialog-binh.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogBinh {
  /* L'âge s'actualise chaque année */
  kimAge = localStorage.getItem('kimAge');
  age = localStorage.getItem('binhAge');
}

@Component({
  selector: 'home-dialog-linh',
  templateUrl: 'home-dialog-linh.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogLinh {
  /* L'âge s'actualise chaque année */
  age = localStorage.getItem('linhAge');
}

@Component({
  selector: 'home-dialog-nam',
  templateUrl: 'home-dialog-nam.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogNam {
  /* L'âge s'actualise chaque année */
  age = localStorage.getItem('namAge');
}

@Component({
  selector: 'home-dialog-loan',
  templateUrl: 'home-dialog-loan.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogLoan {
  /* L'âge s'actualise chaque année */
  age = localStorage.getItem('loanAge');
}

@Component({
  selector: 'home-dialog-tao',
  templateUrl: 'home-dialog-tao.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogTao {
  /* L'âge s'actualise chaque année */
  age = localStorage.getItem('taoAge');
}
@Component({
  selector: 'home-dialog-papa-an',
  templateUrl: 'home-dialog-papa-an.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogPapaAn { }
@Component({
  selector: 'home-dialog-maman-ly',
  templateUrl: 'home-dialog-maman-ly.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogMamanLy { }
@Component({
  selector: 'home-dialog-yaya',
  templateUrl: 'home-dialog-yaya.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogYaya { }
@Component({
  selector: 'home-dialog-papou',
  templateUrl: 'home-dialog-papou.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogPapou { }
@Component({
  selector: 'home-dialog-kim',
  templateUrl: 'home-dialog-kim.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogKim {
  /* L'âge s'actualise chaque année */
  age = localStorage.getItem('kimAge');
}