import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dashboard-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less']
})
export class DashboardAnalysisComponent implements OnInit {
  constructor(public msg: NzMessageService) { }
  searchColumn: STColumn[] = [
    { title: 'rank', index: 'index' },
    {
      title: 'search',
      index: 'keyword',
    },
    {
      type: 'number',
      title: 'usage',
    },
    {
      type: 'number',
      title: 'direction',
      index: 'range',
      render: 'range',
      sorter: (a, b) => a.range - b.range,
    },
  ];


  viewData = [
    { x: 'Private', y: 4123 },
    { x: 'Public', y: 5877 }
  ];
  itemTypeData = [
    {
      x: 'Coffecient of Variation',
      y: 4544
    },
    {
      x: 'Estimate',
      y: 3321
    },
    {
      x: 'Imputation',
      y: 3113
    },
    {
      x: 'Standard Error',
      y: 2341
    },
    {
      x: 'Year to Year Difference',
      y: 1231
    },
    {
      x: 'Others',
      y: 1231
    }
  ];
  proportionData = this.itemTypeData;
  proportionTitle = 'Item Types';
  _proportionType = 'ITEM_TYPES';
  set proportionType(newType: string) {
    if (newType === 'ITEM_TYPES') {
      this.proportionTitle = 'Item Types';
      this.proportionData = this.itemTypeData;
    } else if (newType === 'VIEWS') {
      this.proportionTitle = 'Views';
      this.proportionData = this.viewData;
    }
    this._proportionType = newType;
  }

  salesPieData: any;
  salesTotal = 0;

  saleTabs: any[] = [{ key: 'sales', show: true }, { key: 'visits' }];

  data = {
    visitData: [
      {
        x: '2020-04-09',
        y: 7
      },
      {
        x: '2020-04-10',
        y: 5
      },
      {
        x: '2020-04-11',
        y: 4
      },
      {
        x: '2020-04-12',
        y: 2
      },
      {
        x: '2020-04-13',
        y: 4
      },
      {
        x: '2020-04-14',
        y: 7
      },
      {
        x: '2020-04-15',
        y: 5
      },
      {
        x: '2020-04-16',
        y: 6
      },
      {
        x: '2020-04-17',
        y: 5
      },
      {
        x: '2020-04-18',
        y: 9
      },
      {
        x: '2020-04-19',
        y: 6
      },
      {
        x: '2020-04-20',
        y: 3
      },
      {
        x: '2020-04-21',
        y: 1
      },
      {
        x: '2020-04-22',
        y: 5
      },
      {
        x: '2020-04-23',
        y: 3
      },
      {
        x: '2020-04-24',
        y: 6
      },
      {
        x: '2020-04-25',
        y: 5
      }
    ],
    visitData2: [
      {
        x: '2020-04-09',
        y: 1
      },
      {
        x: '2020-04-10',
        y: 6
      },
      {
        x: '2020-04-11',
        y: 4
      },
      {
        x: '2020-04-12',
        y: 8
      },
      {
        x: '2020-04-13',
        y: 3
      },
      {
        x: '2020-04-14',
        y: 7
      },
      {
        x: '2020-04-15',
        y: 2
      }
    ],
    salesData: [
      {
        x: '1月',
        y: 949
      },
      {
        x: '2月',
        y: 829
      },
      {
        x: '3月',
        y: 1092
      },
      {
        x: '4月',
        y: 1173
      },
      {
        x: '5月',
        y: 851
      },
      {
        x: '6月',
        y: 842
      },
      {
        x: '7月',
        y: 1059
      },
      {
        x: '8月',
        y: 296
      },
      {
        x: '9月',
        y: 807
      },
      {
        x: '10月',
        y: 1192
      },
      {
        x: '11月',
        y: 530
      },
      {
        x: '12月',
        y: 382
      }
    ],
    searchData: [
      {
        index: 1,
        keyword: 'Search Word-0',
        count: 400,
        range: 11,
        status: 0
      },
      {
        index: 2,
        keyword: 'Search Word-1',
        count: 702,
        range: 73,
        status: 0
      },
      {
        index: 3,
        keyword: 'Search Word-2',
        count: 657,
        range: 73,
        status: 0
      },
      {
        index: 4,
        keyword: 'Search Word-3',
        count: 49,
        range: 26,
        status: 1
      },
      {
        index: 5,
        keyword: 'Search Word-4',
        count: 253,
        range: 21,
        status: 0
      },
      {
        index: 6,
        keyword: 'Search Word-5',
        count: 164,
        range: 37,
        status: 1
      },
      {
        index: 7,
        keyword: 'Search Word-6',
        count: 450,
        range: 94,
        status: 1
      },
      {
        index: 8,
        keyword: 'Search Word-7',
        count: 886,
        range: 25,
        status: 0
      },
      {
        index: 9,
        keyword: 'Search Word-8',
        count: 990,
        range: 96,
        status: 1
      },
      {
        index: 10,
        keyword: 'Search Word-9',
        count: 332,
        range: 35,
        status: 0
      },
      {
        index: 11,
        keyword: 'Search Word-10',
        count: 846,
        range: 86,
        status: 1
      },
      {
        index: 12,
        keyword: 'Search Word-11',
        count: 299,
        range: 27,
        status: 0
      },
      {
        index: 13,
        keyword: 'Search Word-12',
        count: 554,
        range: 51,
        status: 0
      },
      {
        index: 14,
        keyword: 'Search Word-13',
        count: 580,
        range: 7,
        status: 1
      },
      {
        index: 15,
        keyword: 'Search Word-14',
        count: 869,
        range: 50,
        status: 1
      },
      {
        index: 16,
        keyword: 'Search Word-15',
        count: 876,
        range: 91,
        status: 0
      },
      {
        index: 17,
        keyword: 'Search Word-16',
        count: 259,
        range: 40,
        status: 0
      },
      {
        index: 18,
        keyword: 'Search Word-17',
        count: 454,
        range: 35,
        status: 0
      },
      {
        index: 19,
        keyword: 'Search Word-18',
        count: 405,
        range: 24,
        status: 0
      },
      {
        index: 20,
        keyword: 'Search Word-19',
        count: 140,
        range: 10,
        status: 1
      },
      {
        index: 21,
        keyword: 'Search Word-20',
        count: 167,
        range: 80,
        status: 1
      },
      {
        index: 22,
        keyword: 'Search Word-21',
        count: 92,
        range: 66,
        status: 0
      },
      {
        index: 23,
        keyword: 'Search Word-22',
        count: 762,
        range: 26,
        status: 0
      },
      {
        index: 24,
        keyword: 'Search Word-23',
        count: 144,
        range: 6,
        status: 0
      },
      {
        index: 25,
        keyword: 'Search Word-24',
        count: 924,
        range: 64,
        status: 1
      },
      {
        index: 26,
        keyword: 'Search Word-25',
        count: 800,
        range: 31,
        status: 0
      },
      {
        index: 27,
        keyword: 'Search Word-26',
        count: 955,
        range: 69,
        status: 0
      },
      {
        index: 28,
        keyword: 'Search Word-27',
        count: 902,
        range: 86,
        status: 0
      },
      {
        index: 29,
        keyword: 'Search Word-28',
        count: 74,
        range: 1,
        status: 0
      },
      {
        index: 30,
        keyword: 'Search Word-29',
        count: 811,
        range: 48,
        status: 1
      },
      {
        index: 31,
        keyword: 'Search Word-30',
        count: 688,
        range: 59,
        status: 0
      },
      {
        index: 32,
        keyword: 'Search Word-31',
        count: 495,
        range: 21,
        status: 0
      },
      {
        index: 33,
        keyword: 'Search Word-32',
        count: 497,
        range: 91,
        status: 0
      },
      {
        index: 34,
        keyword: 'Search Word-33',
        count: 936,
        range: 22,
        status: 1
      },
      {
        index: 35,
        keyword: 'Search Word-34',
        count: 600,
        range: 9,
        status: 1
      },
      {
        index: 36,
        keyword: 'Search Word-35',
        count: 918,
        range: 29,
        status: 1
      },
      {
        index: 37,
        keyword: 'Search Word-36',
        count: 612,
        range: 16,
        status: 1
      },
      {
        index: 38,
        keyword: 'Search Word-37',
        count: 465,
        range: 92,
        status: 0
      },
      {
        index: 39,
        keyword: 'Search Word-38',
        count: 646,
        range: 34,
        status: 1
      },
      {
        index: 40,
        keyword: 'Search Word-39',
        count: 939,
        range: 75,
        status: 0
      },
      {
        index: 41,
        keyword: 'Search Word-40',
        count: 126,
        range: 55,
        status: 1
      },
      {
        index: 42,
        keyword: 'Search Word-41',
        count: 707,
        range: 54,
        status: 1
      },
      {
        index: 43,
        keyword: 'Search Word-42',
        count: 70,
        range: 3,
        status: 0
      },
      {
        index: 44,
        keyword: 'Search Word-43',
        count: 234,
        range: 31,
        status: 0
      },
      {
        index: 45,
        keyword: 'Search Word-44',
        count: 261,
        range: 51,
        status: 0
      },
      {
        index: 46,
        keyword: 'Search Word-45',
        count: 795,
        range: 76,
        status: 0
      },
      {
        index: 47,
        keyword: 'Search Word-46',
        count: 708,
        range: 8,
        status: 1
      },
      {
        index: 48,
        keyword: 'Search Word-47',
        count: 83,
        range: 87,
        status: 1
      },
      {
        index: 49,
        keyword: 'Search Word-48',
        count: 598,
        range: 23,
        status: 0
      },
      {
        index: 50,
        keyword: 'Search Word-49',
        count: 595,
        range: 58,
        status: 0
      }
    ],
    offlineData: [
      {
        name: '门店0',
        cvr: 0.6,
        show: true,
        chart: [
          {
            x: 1586462689661,
            y1: 91,
            y2: 37
          },
          {
            x: 1586464489661,
            y1: 19,
            y2: 25
          },
          {
            x: 1586466289661,
            y1: 63,
            y2: 86
          },
          {
            x: 1586468089661,
            y1: 41,
            y2: 32
          },
          {
            x: 1586469889661,
            y1: 71,
            y2: 19
          },
          {
            x: 1586471689661,
            y1: 29,
            y2: 61
          },
          {
            x: 1586473489661,
            y1: 24,
            y2: 32
          },
          {
            x: 1586475289661,
            y1: 69,
            y2: 19
          },
          {
            x: 1586477089661,
            y1: 31,
            y2: 30
          },
          {
            x: 1586478889661,
            y1: 26,
            y2: 103
          },
          {
            x: 1586480689661,
            y1: 67,
            y2: 62
          },
          {
            x: 1586482489661,
            y1: 109,
            y2: 71
          },
          {
            x: 1586484289661,
            y1: 106,
            y2: 104
          },
          {
            x: 1586486089661,
            y1: 62,
            y2: 70
          },
          {
            x: 1586487889661,
            y1: 46,
            y2: 55
          },
          {
            x: 1586489689661,
            y1: 95,
            y2: 33
          },
          {
            x: 1586491489661,
            y1: 63,
            y2: 10
          },
          {
            x: 1586493289661,
            y1: 76,
            y2: 18
          },
          {
            x: 1586495089661,
            y1: 88,
            y2: 20
          },
          {
            x: 1586496889661,
            y1: 85,
            y2: 14
          }
        ]
      },
      {
        name: '门店1',
        cvr: 0.2,
        show: false,
        chart: [
          {
            x: 1586462689661,
            y1: 91,
            y2: 37
          },
          {
            x: 1586464489661,
            y1: 19,
            y2: 25
          },
          {
            x: 1586466289661,
            y1: 63,
            y2: 86
          },
          {
            x: 1586468089661,
            y1: 41,
            y2: 32
          },
          {
            x: 1586469889661,
            y1: 71,
            y2: 19
          },
          {
            x: 1586471689661,
            y1: 29,
            y2: 61
          },
          {
            x: 1586473489661,
            y1: 24,
            y2: 32
          },
          {
            x: 1586475289661,
            y1: 69,
            y2: 19
          },
          {
            x: 1586477089661,
            y1: 31,
            y2: 30
          },
          {
            x: 1586478889661,
            y1: 26,
            y2: 103
          },
          {
            x: 1586480689661,
            y1: 67,
            y2: 62
          },
          {
            x: 1586482489661,
            y1: 109,
            y2: 71
          },
          {
            x: 1586484289661,
            y1: 106,
            y2: 104
          },
          {
            x: 1586486089661,
            y1: 62,
            y2: 70
          },
          {
            x: 1586487889661,
            y1: 46,
            y2: 55
          },
          {
            x: 1586489689661,
            y1: 95,
            y2: 33
          },
          {
            x: 1586491489661,
            y1: 63,
            y2: 10
          },
          {
            x: 1586493289661,
            y1: 76,
            y2: 18
          },
          {
            x: 1586495089661,
            y1: 88,
            y2: 20
          },
          {
            x: 1586496889661,
            y1: 85,
            y2: 14
          }
        ]
      },
      {
        name: '门店2',
        cvr: 0.5,
        show: false,
        chart: [
          {
            x: 1586462689661,
            y1: 91,
            y2: 37
          },
          {
            x: 1586464489661,
            y1: 19,
            y2: 25
          },
          {
            x: 1586466289661,
            y1: 63,
            y2: 86
          },
          {
            x: 1586468089661,
            y1: 41,
            y2: 32
          },
          {
            x: 1586469889661,
            y1: 71,
            y2: 19
          },
          {
            x: 1586471689661,
            y1: 29,
            y2: 61
          },
          {
            x: 1586473489661,
            y1: 24,
            y2: 32
          },
          {
            x: 1586475289661,
            y1: 69,
            y2: 19
          },
          {
            x: 1586477089661,
            y1: 31,
            y2: 30
          },
          {
            x: 1586478889661,
            y1: 26,
            y2: 103
          },
          {
            x: 1586480689661,
            y1: 67,
            y2: 62
          },
          {
            x: 1586482489661,
            y1: 109,
            y2: 71
          },
          {
            x: 1586484289661,
            y1: 106,
            y2: 104
          },
          {
            x: 1586486089661,
            y1: 62,
            y2: 70
          },
          {
            x: 1586487889661,
            y1: 46,
            y2: 55
          },
          {
            x: 1586489689661,
            y1: 95,
            y2: 33
          },
          {
            x: 1586491489661,
            y1: 63,
            y2: 10
          },
          {
            x: 1586493289661,
            y1: 76,
            y2: 18
          },
          {
            x: 1586495089661,
            y1: 88,
            y2: 20
          },
          {
            x: 1586496889661,
            y1: 85,
            y2: 14
          }
        ]
      },
      {
        name: '门店3',
        cvr: 0.7,
        show: false,
        chart: [
          {
            x: 1586462689661,
            y1: 91,
            y2: 37
          },
          {
            x: 1586464489661,
            y1: 19,
            y2: 25
          },
          {
            x: 1586466289661,
            y1: 63,
            y2: 86
          },
          {
            x: 1586468089661,
            y1: 41,
            y2: 32
          },
          {
            x: 1586469889661,
            y1: 71,
            y2: 19
          },
          {
            x: 1586471689661,
            y1: 29,
            y2: 61
          },
          {
            x: 1586473489661,
            y1: 24,
            y2: 32
          },
          {
            x: 1586475289661,
            y1: 69,
            y2: 19
          },
          {
            x: 1586477089661,
            y1: 31,
            y2: 30
          },
          {
            x: 1586478889661,
            y1: 26,
            y2: 103
          },
          {
            x: 1586480689661,
            y1: 67,
            y2: 62
          },
          {
            x: 1586482489661,
            y1: 109,
            y2: 71
          },
          {
            x: 1586484289661,
            y1: 106,
            y2: 104
          },
          {
            x: 1586486089661,
            y1: 62,
            y2: 70
          },
          {
            x: 1586487889661,
            y1: 46,
            y2: 55
          },
          {
            x: 1586489689661,
            y1: 95,
            y2: 33
          },
          {
            x: 1586491489661,
            y1: 63,
            y2: 10
          },
          {
            x: 1586493289661,
            y1: 76,
            y2: 18
          },
          {
            x: 1586495089661,
            y1: 88,
            y2: 20
          },
          {
            x: 1586496889661,
            y1: 85,
            y2: 14
          }
        ]
      },
      {
        name: '门店4',
        cvr: 0.3,
        show: false,
        chart: [
          {
            x: 1586462689661,
            y1: 91,
            y2: 37
          },
          {
            x: 1586464489661,
            y1: 19,
            y2: 25
          },
          {
            x: 1586466289661,
            y1: 63,
            y2: 86
          },
          {
            x: 1586468089661,
            y1: 41,
            y2: 32
          },
          {
            x: 1586469889661,
            y1: 71,
            y2: 19
          },
          {
            x: 1586471689661,
            y1: 29,
            y2: 61
          },
          {
            x: 1586473489661,
            y1: 24,
            y2: 32
          },
          {
            x: 1586475289661,
            y1: 69,
            y2: 19
          },
          {
            x: 1586477089661,
            y1: 31,
            y2: 30
          },
          {
            x: 1586478889661,
            y1: 26,
            y2: 103
          },
          {
            x: 1586480689661,
            y1: 67,
            y2: 62
          },
          {
            x: 1586482489661,
            y1: 109,
            y2: 71
          },
          {
            x: 1586484289661,
            y1: 106,
            y2: 104
          },
          {
            x: 1586486089661,
            y1: 62,
            y2: 70
          },
          {
            x: 1586487889661,
            y1: 46,
            y2: 55
          },
          {
            x: 1586489689661,
            y1: 95,
            y2: 33
          },
          {
            x: 1586491489661,
            y1: 63,
            y2: 10
          },
          {
            x: 1586493289661,
            y1: 76,
            y2: 18
          },
          {
            x: 1586495089661,
            y1: 88,
            y2: 20
          },
          {
            x: 1586496889661,
            y1: 85,
            y2: 14
          }
        ]
      },
      {
        name: '门店5',
        cvr: 0.1,
        show: false,
        chart: [
          {
            x: 1586462689661,
            y1: 91,
            y2: 37
          },
          {
            x: 1586464489661,
            y1: 19,
            y2: 25
          },
          {
            x: 1586466289661,
            y1: 63,
            y2: 86
          },
          {
            x: 1586468089661,
            y1: 41,
            y2: 32
          },
          {
            x: 1586469889661,
            y1: 71,
            y2: 19
          },
          {
            x: 1586471689661,
            y1: 29,
            y2: 61
          },
          {
            x: 1586473489661,
            y1: 24,
            y2: 32
          },
          {
            x: 1586475289661,
            y1: 69,
            y2: 19
          },
          {
            x: 1586477089661,
            y1: 31,
            y2: 30
          },
          {
            x: 1586478889661,
            y1: 26,
            y2: 103
          },
          {
            x: 1586480689661,
            y1: 67,
            y2: 62
          },
          {
            x: 1586482489661,
            y1: 109,
            y2: 71
          },
          {
            x: 1586484289661,
            y1: 106,
            y2: 104
          },
          {
            x: 1586486089661,
            y1: 62,
            y2: 70
          },
          {
            x: 1586487889661,
            y1: 46,
            y2: 55
          },
          {
            x: 1586489689661,
            y1: 95,
            y2: 33
          },
          {
            x: 1586491489661,
            y1: 63,
            y2: 10
          },
          {
            x: 1586493289661,
            y1: 76,
            y2: 18
          },
          {
            x: 1586495089661,
            y1: 88,
            y2: 20
          },
          {
            x: 1586496889661,
            y1: 85,
            y2: 14
          }
        ]
      },
      {
        name: '门店6',
        cvr: 0.3,
        show: false,
        chart: [
          {
            x: 1586462689661,
            y1: 91,
            y2: 37
          },
          {
            x: 1586464489661,
            y1: 19,
            y2: 25
          },
          {
            x: 1586466289661,
            y1: 63,
            y2: 86
          },
          {
            x: 1586468089661,
            y1: 41,
            y2: 32
          },
          {
            x: 1586469889661,
            y1: 71,
            y2: 19
          },
          {
            x: 1586471689661,
            y1: 29,
            y2: 61
          },
          {
            x: 1586473489661,
            y1: 24,
            y2: 32
          },
          {
            x: 1586475289661,
            y1: 69,
            y2: 19
          },
          {
            x: 1586477089661,
            y1: 31,
            y2: 30
          },
          {
            x: 1586478889661,
            y1: 26,
            y2: 103
          },
          {
            x: 1586480689661,
            y1: 67,
            y2: 62
          },
          {
            x: 1586482489661,
            y1: 109,
            y2: 71
          },
          {
            x: 1586484289661,
            y1: 106,
            y2: 104
          },
          {
            x: 1586486089661,
            y1: 62,
            y2: 70
          },
          {
            x: 1586487889661,
            y1: 46,
            y2: 55
          },
          {
            x: 1586489689661,
            y1: 95,
            y2: 33
          },
          {
            x: 1586491489661,
            y1: 63,
            y2: 10
          },
          {
            x: 1586493289661,
            y1: 76,
            y2: 18
          },
          {
            x: 1586495089661,
            y1: 88,
            y2: 20
          },
          {
            x: 1586496889661,
            y1: 85,
            y2: 14
          }
        ]
      },
      {
        name: '门店7',
        cvr: 0.1,
        show: false,
        chart: [
          {
            x: 1586462689661,
            y1: 91,
            y2: 37
          },
          {
            x: 1586464489661,
            y1: 19,
            y2: 25
          },
          {
            x: 1586466289661,
            y1: 63,
            y2: 86
          },
          {
            x: 1586468089661,
            y1: 41,
            y2: 32
          },
          {
            x: 1586469889661,
            y1: 71,
            y2: 19
          },
          {
            x: 1586471689661,
            y1: 29,
            y2: 61
          },
          {
            x: 1586473489661,
            y1: 24,
            y2: 32
          },
          {
            x: 1586475289661,
            y1: 69,
            y2: 19
          },
          {
            x: 1586477089661,
            y1: 31,
            y2: 30
          },
          {
            x: 1586478889661,
            y1: 26,
            y2: 103
          },
          {
            x: 1586480689661,
            y1: 67,
            y2: 62
          },
          {
            x: 1586482489661,
            y1: 109,
            y2: 71
          },
          {
            x: 1586484289661,
            y1: 106,
            y2: 104
          },
          {
            x: 1586486089661,
            y1: 62,
            y2: 70
          },
          {
            x: 1586487889661,
            y1: 46,
            y2: 55
          },
          {
            x: 1586489689661,
            y1: 95,
            y2: 33
          },
          {
            x: 1586491489661,
            y1: 63,
            y2: 10
          },
          {
            x: 1586493289661,
            y1: 76,
            y2: 18
          },
          {
            x: 1586495089661,
            y1: 88,
            y2: 20
          },
          {
            x: 1586496889661,
            y1: 85,
            y2: 14
          }
        ]
      },
      {
        name: '门店8',
        cvr: 0.1,
        show: false,
        chart: [
          {
            x: 1586462689661,
            y1: 91,
            y2: 37
          },
          {
            x: 1586464489661,
            y1: 19,
            y2: 25
          },
          {
            x: 1586466289661,
            y1: 63,
            y2: 86
          },
          {
            x: 1586468089661,
            y1: 41,
            y2: 32
          },
          {
            x: 1586469889661,
            y1: 71,
            y2: 19
          },
          {
            x: 1586471689661,
            y1: 29,
            y2: 61
          },
          {
            x: 1586473489661,
            y1: 24,
            y2: 32
          },
          {
            x: 1586475289661,
            y1: 69,
            y2: 19
          },
          {
            x: 1586477089661,
            y1: 31,
            y2: 30
          },
          {
            x: 1586478889661,
            y1: 26,
            y2: 103
          },
          {
            x: 1586480689661,
            y1: 67,
            y2: 62
          },
          {
            x: 1586482489661,
            y1: 109,
            y2: 71
          },
          {
            x: 1586484289661,
            y1: 106,
            y2: 104
          },
          {
            x: 1586486089661,
            y1: 62,
            y2: 70
          },
          {
            x: 1586487889661,
            y1: 46,
            y2: 55
          },
          {
            x: 1586489689661,
            y1: 95,
            y2: 33
          },
          {
            x: 1586491489661,
            y1: 63,
            y2: 10
          },
          {
            x: 1586493289661,
            y1: 76,
            y2: 18
          },
          {
            x: 1586495089661,
            y1: 88,
            y2: 20
          },
          {
            x: 1586496889661,
            y1: 85,
            y2: 14
          }
        ]
      },
      {
        name: '门店9',
        cvr: 0.6,
        show: false,
        chart: [
          {
            x: 1586462689661,
            y1: 91,
            y2: 37
          },
          {
            x: 1586464489661,
            y1: 19,
            y2: 25
          },
          {
            x: 1586466289661,
            y1: 63,
            y2: 86
          },
          {
            x: 1586468089661,
            y1: 41,
            y2: 32
          },
          {
            x: 1586469889661,
            y1: 71,
            y2: 19
          },
          {
            x: 1586471689661,
            y1: 29,
            y2: 61
          },
          {
            x: 1586473489661,
            y1: 24,
            y2: 32
          },
          {
            x: 1586475289661,
            y1: 69,
            y2: 19
          },
          {
            x: 1586477089661,
            y1: 31,
            y2: 30
          },
          {
            x: 1586478889661,
            y1: 26,
            y2: 103
          },
          {
            x: 1586480689661,
            y1: 67,
            y2: 62
          },
          {
            x: 1586482489661,
            y1: 109,
            y2: 71
          },
          {
            x: 1586484289661,
            y1: 106,
            y2: 104
          },
          {
            x: 1586486089661,
            y1: 62,
            y2: 70
          },
          {
            x: 1586487889661,
            y1: 46,
            y2: 55
          },
          {
            x: 1586489689661,
            y1: 95,
            y2: 33
          },
          {
            x: 1586491489661,
            y1: 63,
            y2: 10
          },
          {
            x: 1586493289661,
            y1: 76,
            y2: 18
          },
          {
            x: 1586495089661,
            y1: 88,
            y2: 20
          },
          {
            x: 1586496889661,
            y1: 85,
            y2: 14
          }
        ]
      }
    ],
    offlineChartData: [
      {
        x: 1586462689661,
        y1: 91,
        y2: 37
      },
      {
        x: 1586464489661,
        y1: 19,
        y2: 25
      },
      {
        x: 1586466289661,
        y1: 63,
        y2: 86
      },
      {
        x: 1586468089661,
        y1: 41,
        y2: 32
      },
      {
        x: 1586469889661,
        y1: 71,
        y2: 19
      },
      {
        x: 1586471689661,
        y1: 29,
        y2: 61
      },
      {
        x: 1586473489661,
        y1: 24,
        y2: 32
      },
      {
        x: 1586475289661,
        y1: 69,
        y2: 19
      },
      {
        x: 1586477089661,
        y1: 31,
        y2: 30
      },
      {
        x: 1586478889661,
        y1: 26,
        y2: 103
      },
      {
        x: 1586480689661,
        y1: 67,
        y2: 62
      },
      {
        x: 1586482489661,
        y1: 109,
        y2: 71
      },
      {
        x: 1586484289661,
        y1: 106,
        y2: 104
      },
      {
        x: 1586486089661,
        y1: 62,
        y2: 70
      },
      {
        x: 1586487889661,
        y1: 46,
        y2: 55
      },
      {
        x: 1586489689661,
        y1: 95,
        y2: 33
      },
      {
        x: 1586491489661,
        y1: 63,
        y2: 10
      },
      {
        x: 1586493289661,
        y1: 76,
        y2: 18
      },
      {
        x: 1586495089661,
        y1: 88,
        y2: 20
      },
      {
        x: 1586496889661,
        y1: 85,
        y2: 14
      }
    ],
    salesTypeDataOnline: [
      {
        x: '家用电器',
        y: 244
      },
      {
        x: '食用酒水',
        y: 321
      },
      {
        x: '个护健康',
        y: 311
      },
      {
        x: '服饰箱包',
        y: 41
      },
      {
        x: '母婴产品',
        y: 121
      },
      {
        x: '其他',
        y: 111
      }
    ],
    salesTypeDataOffline: [
      {
        x: '家用电器',
        y: 99
      },
      {
        x: '个护健康',
        y: 188
      },
      {
        x: '服饰箱包',
        y: 344
      },
      {
        x: '母婴产品',
        y: 255
      },
      {
        x: '其他',
        y: 65
      }
    ],
    radarData: [
      {
        name: '个人',
        label: '引用',
        value: 10
      },
      {
        name: '个人',
        label: '口碑',
        value: 8
      },
      {
        name: '个人',
        label: '产量',
        value: 4
      },
      {
        name: '个人',
        label: '贡献',
        value: 5
      },
      {
        name: '个人',
        label: '热度',
        value: 7
      },
      {
        name: '团队',
        label: '引用',
        value: 3
      },
      {
        name: '团队',
        label: '口碑',
        value: 9
      },
      {
        name: '团队',
        label: '产量',
        value: 6
      },
      {
        name: '团队',
        label: '贡献',
        value: 3
      },
      {
        name: '团队',
        label: '热度',
        value: 1
      },
      {
        name: '部门',
        label: '引用',
        value: 4
      },
      {
        name: '部门',
        label: '口碑',
        value: 1
      },
      {
        name: '部门',
        label: '产量',
        value: 6
      },
      {
        name: '部门',
        label: '贡献',
        value: 5
      },
      {
        name: '部门',
        label: '热度',
        value: 7
      }
    ]
  };
  ngOnInit(): void {
  }

}
