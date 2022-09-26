import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaterialService } from 'src/app/services/material.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {
  materialsFromLocalStorage: any; //* localStorage'dan gelen tüm malzemelerin tutulduğu değişken.

  materials: any; //* Tüm malzemeler.
  meatTypes: any[] = []; //* Et türleri.
  hamburgerMaterials: any[] = []; //* Hamburger için olan malzemeler (marul, turşu, soğan, domates).

  isHamburgerMaterialZero: any; //* Hamburger listesindeki malzemelerin miktarını kontrol etmek için kullanılan değişken.
  isFriesMaterialZero: any; //* Kızartma (patates) listesindeki malzemelerin miktarını kontrol etmek için kullanılan değişken.
  isDrinksMaterialZero: any; //* İçecek (cola) listesindeki malzemelerin miktarını kontrol etmek için kullanılan değişken.
  isSaucesZero: any; //* Soslar listesindeki malzemelerin miktarını kontrol etmek için kullanılan değişken.

  isShowOrderForm = false; //* "Sipariş Al" işleminden sonra malzeme kontrolünün ardından formun gösterilip gösterilmeyeceğinin tutulduğu değişken.

  isRareType = false; //* Köfte seçilir ise pişme derecelerini göstermek için kullanılan değişken.

  meatType = 0; //* Seçilen et türünün tutulduğu değişken.
  rareType = 0; //* Köfte seçilir ise pişme derecesinin tutulduğu değişken.

  hamburgerForm: FormGroup;

  isHamburgerCooked = false; //* Hamburger'in pişip pişmediği bilgisinin tutulduğu değişken.
  isPotatoesFried = false; //* Patatesin pişip pişmediği bilgisinin tutulduğu değişken.
  isDrinkReady = false; //* İçeceğin hazır olup olmadığı bilgisinin tutulduğu değişken.
  isAllCooked = false; //* Hamburger, patates ve içeceklerin hazır olup olmadığı bilgisinin tutulduğu değişken.
  isTrayReady = false; //* Tepsinin hazır olup olmadığı bilgisinin tutulduğu değişken.
  isServe = false; //* Servis edilip edilmediği bilgisinin tutulduğu değişken.

  totalTime: any = 0; //* Toplam hazırlanma süresinin tutulduğu değişken.

  constructor(
    private materialService: MaterialService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getMeatTypes();
    this.setHamburgerForm();

    this.isAllCooked = false;
  }

  //* Sayfa yenilendiğinde değişiklik yapılan verilerin local storage'de aynı kalması gerektiğinden dolayı kullanıldı.
  ngAfterViewInit() {
    if (!localStorage.getItem('materials')) {
      this.getMaterials();
    }
  }

  //* Köfte seçildiğinde ekstra olarak pişme derecesini de kontrol etmesi, tavuk da ise buna gerek olmayacağı için hamburgerForm...
  //* ... üzerindeki 'required' olan alanlarda problem olmaması adına kullanıldı.
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  //* Tüm malzemeleri getiren metot.
  getMaterials() {
    this.materials = this.materialService.getMaterials();
    localStorage.setItem('materials', JSON.stringify(this.materials));
  }

  getMeatTypes() {
    this.meatTypes = this.materialService.getMeatTypes();
  }

  newOrder() {
    return new Promise<void>((resolve, reject) => {
      let newOrderTimerId = setInterval(() => {
        try {
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(newOrderTimerId);
      }, 1000);

      this.totalTime = newOrderTimerId;
    });
  }

  materialsCheck = async () => {
    await this.newOrder;

    //* Local Storage'dan gelen hamburger malzemeleri.
    var materialsFromLocalStorage = JSON.parse(
      localStorage.getItem('materials') || '{}'
    );

    let materialCheckTimerId = setInterval(() => {
      for (let i = 0; i < 10; i++) {
        this.isHamburgerMaterialZero =
          materialsFromLocalStorage.burgerMaterials.find(
            (element: any) => element.quantity == 0
          );

        this.isFriesMaterialZero = materialsFromLocalStorage.fries.find(
          (element: any) => element.quantity == 0
        );

        this.isDrinksMaterialZero = materialsFromLocalStorage.drinks.find(
          (element: any) => element.quantity == 0
        );

        this.isSaucesZero = materialsFromLocalStorage.sauces.find(
          (element: any) => element.quantity == 0
        );
      }

      if (
        this.isHamburgerMaterialZero ||
        this.isFriesMaterialZero ||
        this.isDrinksMaterialZero
      ) {
        this.toastr.error(
          'Malzemeler içerisinde miktarı 0 olan malzemeler mevcut; yeni sipariş oluşturamazsınız!'
        );
        this.isShowOrderForm = false;
      } else {
        this.toastr.success(
          'Malzeme miktarında problem bulunmamaktadır. Sipariş formu hazırlanıyor...'
        );
        this.isShowOrderForm = true;
      }
    }, 3000);

    setTimeout(() => {
      clearInterval(materialCheckTimerId);
    }, 3000);

    this.totalTime += materialCheckTimerId;
  };

  showForm = async () => {
    await this.newOrder();
    this.materialsCheck();
  };

  onMeatTypeChange = async ($event: any) => {
    await this.materialsCheck;

    let meatTypeChangeTimerId = setInterval(() => {
      this.meatType =
        $event.target.options[$event.target.options.selectedIndex].value;
      if (this.meatType == 4) {
        this.isRareType = true;
      } else if (this.meatType == 5) {
        this.isRareType = false;
      } else {
        this.isRareType = false;
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(meatTypeChangeTimerId);
      this.onMeatTypeChange;
    }, 1000);

    this.totalTime += 1; //* Müşteri kararını değiştirebileceği için her bir köfte mi yoksa tavuk mu sorgusu için 1 saniye ekler.
  };

  onRareTypeChange($event: any) {
    this.rareType =
      $event.target.options[$event.target.options.selectedIndex].value;

    this.hamburgerFormValidator;
  }

  setHamburgerForm(): any {
    this.hamburgerForm = this.formBuilder.group({
      meatType: new FormControl('', Validators.required),
      rareType: new FormControl('', this.hamburgerFormValidator),
    });
  }

  //* Köfte seçilir ise pişme derecesi de zorunlu, tavuk seçilir ise pişme derecesi seçilmeyeceği için zorunlu olmayacak.
  private readonly hamburgerFormValidator: ValidatorFn = (c) => {
    return this.meatType == 4
      ? Validators.required(c)
      : Validators.nullValidator(c);
  };

  makeAHamburger = async () => {
    this.materialsFromLocalStorage = JSON.parse(
      localStorage.getItem('materials') || '{}'
    );

    if (this.meatType == 4) {
      if (this.rareType == 2) {
        let rareTypeTimerId = setInterval(() => {
          for (
            let i = 0;
            i < this.materialsFromLocalStorage.burgerMaterials.length;
            i++
          ) {
            if (this.materialsFromLocalStorage.burgerMaterials[i].id !== '5') {
              this.materialsFromLocalStorage.burgerMaterials[i].quantity -= 1;

              localStorage.setItem(
                'materials',
                JSON.stringify(this.materialsFromLocalStorage)
              );
            }
          }
        }, 2000);

        setTimeout(() => {
          clearInterval(rareTypeTimerId);
        }, 2000);

        this.isHamburgerCooked = true;
        this.totalTime += 2;
      } else if (this.rareType == 3) {
        let rareTypeTimerId = setInterval(() => {
          for (
            let i = 0;
            i < this.materialsFromLocalStorage.burgerMaterials.length;
            i++
          ) {
            if (this.materialsFromLocalStorage.burgerMaterials[i].id !== '5') {
              this.materialsFromLocalStorage.burgerMaterials[i].quantity -= 1;

              localStorage.setItem(
                'materials',
                JSON.stringify(this.materialsFromLocalStorage)
              );
            }
          }
        }, 3000);

        setTimeout(() => {
          clearInterval(rareTypeTimerId);
        }, 3000);

        this.isHamburgerCooked = true;
        this.totalTime += 3;
      } else if (this.rareType == 4) {
        let rareTypeTimerId = setInterval(() => {
          for (
            let i = 0;
            i < this.materialsFromLocalStorage.burgerMaterials.length;
            i++
          ) {
            if (this.materialsFromLocalStorage.burgerMaterials[i].id !== '5') {
              this.materialsFromLocalStorage.burgerMaterials[i].quantity -= 1;

              localStorage.setItem(
                'materials',
                JSON.stringify(this.materialsFromLocalStorage)
              );
            }
          }
        }, 4000);

        setTimeout(() => {
          clearInterval(rareTypeTimerId);
        }, 4000);

        this.isHamburgerCooked = true;
        this.totalTime += 4;
        console.log('Toplam Süre: ', this.totalTime);
      }
    } else if (this.meatType == 5) {
      let chickenTimerId = setInterval(() => {
        for (
          let i = 0;
          i < this.materialsFromLocalStorage.burgerMaterials.length;
          i++
        ) {
          if (this.materialsFromLocalStorage.burgerMaterials[i].id !== '4') {
            this.materialsFromLocalStorage.burgerMaterials[i].quantity -= 1;

            localStorage.setItem(
              'materials',
              JSON.stringify(this.materialsFromLocalStorage)
            );
          }
        }
      }, 3000);

      setTimeout(() => {
        clearInterval(chickenTimerId);
      }, 3000);

      this.isHamburgerCooked = true;
      this.totalTime += 3;
    }
  };

  fryThePotatoes = async () => {
    this.materialsFromLocalStorage = JSON.parse(
      localStorage.getItem('materials') || '{}'
    );

    let fryPotatoesTimerId = setInterval(() => {
      for (let i = 0; i < this.materialsFromLocalStorage.fries.length; i++) {
        this.materialsFromLocalStorage.fries[i].quantity -= 1;

        localStorage.setItem(
          'materials',
          JSON.stringify(this.materialsFromLocalStorage)
        );
      }
    }, 5000);

    setTimeout(() => {
      clearInterval(fryPotatoesTimerId);
    }, 5000);

    this.isPotatoesFried = true;
    this.totalTime += 5;
  };

  prepareADrink = async () => {
    this.materialsFromLocalStorage = JSON.parse(
      localStorage.getItem('materials') || '{}'
    );

    let drinkTimerId = setInterval(() => {
      for (let i = 0; i < this.materialsFromLocalStorage.drinks.length; i++) {
        this.materialsFromLocalStorage.drinks[i].quantity -= 1;

        localStorage.setItem(
          'materials',
          JSON.stringify(this.materialsFromLocalStorage)
        );
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(drinkTimerId);
    }, 2000);

    this.isDrinkReady = true;
    this.totalTime += 2;
  };

  prepareTheOrder = async (item: any) => {
    await this.onMeatTypeChange;

    this.makeAHamburger();
    this.fryThePotatoes();
    this.prepareADrink();

    this.isAllCooked = true;

    setTimeout(() => {
      this.toastr.info('Hamburger, patates kızartması ve cola hazırlandı.');
    }, 1000);
  };

  //* Sosları ve ürünleri servis tepsisine koy.
  putOnTray = async () => {
    await this.prepareTheOrder;

    this.materialsFromLocalStorage = JSON.parse(
      localStorage.getItem('materials') || '{}'
    );

    let saucesTimerId = setInterval(() => {
      for (let i = 0; i < this.materialsFromLocalStorage.sauces.length; i++) {
        this.materialsFromLocalStorage.sauces[i].quantity -= 1;

        localStorage.setItem(
          'materials',
          JSON.stringify(this.materialsFromLocalStorage)
        );
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(saucesTimerId);
      this.toastr.info('Ürünler tepsiye konuldu!');
    }, 1000);

    this.isTrayReady = true;
    this.totalTime += 1;
  };

  serveTheCustomer = async () => {
    await this.putOnTray;

    let serveTimerId = setInterval(() => {
      this.toastr.info(
        'Müşteriye servis ediliyor. Sonrasında yönlendirme işlemi yapılacak. Lütfen bekleyiniz.'
      );
    }, 1000);

    setTimeout(() => {
      clearInterval(serveTimerId);
    }, 1000);

    this.totalTime += 1;
    this.isServe = true;

    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };
}
