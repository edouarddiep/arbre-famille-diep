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
    src: ['assets/sounds/daddy_cool.mp3'], html5: true, loop: true
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
    src: ['assets/sounds/princesse_sarah.mp3'], html5: true, loop: true
  });

  namSong = new Howl({
    src: ['assets/sounds/mysterieuses_cites_dor.mp3'], html5: true, loop: true
  });

  loanSong = new Howl({
    src: ['assets/sounds/dragon_ball_z.mp3'], html5: true, loop: true
  });

  taoSong = new Howl({
    src: ['assets/sounds/kung_fu_fighting.mp3'], html5: true, loop: true
  });

  constructor(public dialog: MatDialog) { }


  ngOnInit() {
    // Set starter animations.
    setTimeout(() => {
      document.getElementById("homeTitle").className = "home-title-show";
    }, 2000);
    setTimeout(() => {
      document.getElementById("tree").className = "tree";
    }, 100);

    // Play maman's song.
    this.mainSong.play();
    this.mainSong.seek(.4);

    // Change global volume.
    Howler.volume(0.5);
  }

  openDialog(e) {
    e.preventDefault();
    const id = e.target.id;
    let dialogRef;
    switch (id) {
      case "eric":
        dialogRef = this.dialog.open(HomeDialogEric, {
          width: '40%',
          height: '75%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.ericSong.play();
        this.ericSong.seek(1);
        dialogRef.afterClosed().subscribe(() => {
          this.ericSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "edouard":
        dialogRef = this.dialog.open(HomeDialogEdouard, {
          width: '40%',
          height: '80%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.edouardSong.play();
        this.edouardSong.seek(.8);
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
          width: '40%',
          height: '85%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.lauraSong.play();
        this.lauraSong.seek(.4);
        dialogRef.afterClosed().subscribe(() => {
          this.lauraSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "binh":
        dialogRef = this.dialog.open(HomeDialogBinh, {
          width: '40%',
          height: '100%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.binhSong.play();
        this.binhSong.seek(15);
        this.binhSong.fade(0, 1, 500);
        dialogRef.afterClosed().subscribe(() => {
          this.binhSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "tina":
        dialogRef = this.dialog.open(HomeDialogMaman, {
          width: '40%',
          height: '100%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.mamanSong.play();
        this.mamanSong.seek(.5);
        dialogRef.afterClosed().subscribe(() => {
          this.mamanSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "yaya":
        dialogRef = this.dialog.open(HomeDialogYaya, {
          width: '40%',
          height: '95%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.yayaSong.play();
        this.yayaSong.seek(8);
        this.yayaSong.fade(0, 1, 1000);
        dialogRef.afterClosed().subscribe(() => {
          this.yayaSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "papou":
        dialogRef = this.dialog.open(HomeDialogPapou, {
          width: '40%',
          height: '85%',
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
          width: '40%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.kimSong.play();
        dialogRef.afterClosed().subscribe(() => {
          this.kimSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "linh":
        dialogRef = this.dialog.open(HomeDialogLinh, {
          width: '40%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.linhSong.play();
        this.linhSong.seek(10);
        this.linhSong.fade(0, 1, 1500);
        dialogRef.afterClosed().subscribe(() => {
          this.linhSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "nam":
        dialogRef = this.dialog.open(HomeDialogNam, {
          width: '40%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.namSong.play();
        this.namSong.seek(48);
        dialogRef.afterClosed().subscribe(() => {
          this.namSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "loan":
        dialogRef = this.dialog.open(HomeDialogLoan, {
          width: '40%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.loanSong.play();
        this.loanSong.fade(0, 1, 1500);
        dialogRef.afterClosed().subscribe(() => {
          this.loanSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "tao":
        dialogRef = this.dialog.open(HomeDialogTao, {
          width: '40%',
          panelClass: 'custom-modalbox',
        });
        this.mainSong.mute(true);
        this.taoSong.play();
        this.taoSong.seek(12.5);
        dialogRef.afterClosed().subscribe(() => {
          this.taoSong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "mamanLy":
        dialogRef = this.dialog.open(HomeDialogMamanLy, {
          width: '40%',
          height: '85%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.mamanLySong.play();
        this.mamanLySong.seek(2);
        this.mamanLySong.fade(0, 1, 500);
        dialogRef.afterClosed().subscribe(() => {
          this.mamanLySong.stop();
          this.mainSong.mute(false);
        });
        break;
      case "papaAn":
        dialogRef = this.dialog.open(HomeDialogPapaAn, {
          width: '40%',
          height: '90%',
          panelClass: 'custom-modalbox'
        });
        this.mainSong.mute(true);
        this.papaAnSong.play();
        this.papaAnSong.seek(25);
        this.papaAnSong.fade(0, 1, 1000);
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
export class HomeDialogEric { }

@Component({
  selector: 'home-dialog-edouard',
  templateUrl: 'home-dialog-edouard.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogEdouard { }

@Component({
  selector: 'home-dialog-laura',
  templateUrl: 'home-dialog-laura.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogLaura { }

@Component({
  selector: 'home-dialog-maman',
  templateUrl: 'home-dialog-maman.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogMaman { }

@Component({
  selector: 'home-dialog-binh',
  templateUrl: 'home-dialog-binh.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogBinh {
}

@Component({
  selector: 'home-dialog-linh',
  templateUrl: 'home-dialog-linh.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogLinh { }

@Component({
  selector: 'home-dialog-nam',
  templateUrl: 'home-dialog-nam.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogNam { }

@Component({
  selector: 'home-dialog-loan',
  templateUrl: 'home-dialog-loan.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogLoan { }

@Component({
  selector: 'home-dialog-tao',
  templateUrl: 'home-dialog-tao.html',
  styleUrls: ['./home.component.css']
})
export class HomeDialogTao { }
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
export class HomeDialogKim { }