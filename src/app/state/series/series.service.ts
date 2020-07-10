import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DFAPI, DFAPI_KEY } from '../../api';
import { SurveysQuery } from '../survey/surveys.query';
import { DfResource, Series } from './series.model';
import { SeriesStore } from './series.store';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  constructor(private seriesStore: SeriesStore, private http: HttpClient, private surveysQuery: SurveysQuery) { }

  getAll(keyword: string, uploadedNames: string, filters, pageNumber: number, pageSize: number) {
    // console.log(this.seriesQuery.getHasCache());
    let params = new HttpParams();
    let dfParams = '';
    if (keyword) {
      dfParams += '((name contains ' + keyword + ')' + ' or ' + '(topic contains ' + keyword + ')' + ' or ' + '(tbl contains ' + keyword + ')' + ' or ' + '(naics contains ' + keyword + '))';
    }

    if (uploadedNames) {
      if (dfParams) {
        dfParams = dfParams + ' and ' + '(name in (' + uploadedNames.split(',').map(name => '"' + name.trim() + '"').join(',') + '))';
      } else {
        dfParams = 'name in (' + uploadedNames.split(',').map(name => '"' + name.trim() + '"').join(',') + ')';
      }

    }
    dfParams = this.constructDfParams(keyword, filters, dfParams);

    if (dfParams) {
      params = params.append('filter', dfParams);
    }
    params = params.append('order', 'item_type, name');
    params = params.append('include_count', 'true');
    params = params.append('limit', pageSize.toString());
    params = params.append('offset', ((pageNumber - 1) * pageSize).toString());
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    return this.http.get<DfResource>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { params, headers }).pipe(
      tap(series => {
        this.seriesStore.set(series.resource);
        this.updateCount(series.meta.count);
      })
    );
  }

  getSchema() {
    const params = new HttpParams();
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    return this.http.get<any>(`${DFAPI}/_schema/${this.surveysQuery.getActive().databaseTable}`, { params, headers }).pipe(
      tap(schema => {
        const statPeriods = schema.field.map(field => field.name).filter(name => name.substring(0, 3) === 'val').sort();
        this.updateValHeaders(statPeriods);
        this.updateFrom(statPeriods[0]);
        this.updateTo(statPeriods[statPeriods.length - 1]);
      }, error => {
        console.warn(`StartupService.load: Network request faileddddddddd`, error);
      })
    );
  }

  download(keyword: string, uploadedNames: string, filters, type: string) {
    let params = new HttpParams();
    let dfParams = '';
    if (keyword) {
      dfParams += '((name contains ' + keyword + ')' + ' or ' + '(topic contains ' + keyword + ')' + ' or ' + '(tbl contains ' + keyword + ')' + ' or ' + '(naics contains ' + keyword + '))';
    }
    if (uploadedNames) {
      if (dfParams) {
        dfParams = dfParams + ' and ' + '(name in (' + uploadedNames.split(',').map(name => '"' + name.trim() + '"').join(',') + '))';
      } else {
        dfParams = 'name in (' + uploadedNames.split(',').map(name => '"' + name.trim() + '"').join(',') + ')';
      }
    }

    dfParams = this.constructDfParams(keyword, filters, dfParams);

    if (dfParams) {
      params = params.append('filter', dfParams);
    }
    params = params.append('order', 'item_type, name');
    // if (type = "csv") {
    //   params = params.append('accept', 'text/csv');
    // } else {
    params = params.append('accept', 'text/csv');
    // }

    return this.http.get(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`,
      { params, responseType: 'arraybuffer' })
      .pipe(
        map((file: ArrayBuffer) => {
          return file;
        })
      );
  }

  getSeriesNames(keyword: string, filters, globalSearch?: boolean): Observable<DfResource> {
    let params = new HttpParams();
    let dfParams = '';
    if (keyword) {
      dfParams += '(name contains ' + keyword + ')';
    }
    dfParams = this.constructDfParams(keyword, filters, dfParams);
    if (dfParams) {
      params = params.append('filter', dfParams);
    }

    params = params.append('fields', 'name');
    params = params.append('group', 'name');
    params = params.append('order', 'name');
    params = params.append('include_count', 'true');
    if (globalSearch) {
      params = params.append('limit', '3');
      params = params.append('offset', '0');
    }
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    return this.http.get<DfResource>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { params, headers });
  }

  getSeriesTopics(keyword: string, filters, globalSearch?: boolean): Observable<DfResource> {
    let params = new HttpParams();
    let dfParams = '';
    if (keyword) {
      dfParams += '(topic contains ' + keyword + ')';
    }

    dfParams = this.constructDfParams(keyword, filters, dfParams);
    if (dfParams) {
      params = params.append('filter', dfParams);
    }

    params = params.append('fields', 'topic');
    params = params.append('group', 'topic');
    params = params.append('include_count', 'true');
    params = params.append('order', 'topic');
    if (globalSearch) {
      params = params.append('limit', '3');
      params = params.append('offset', '0');
    }
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    return this.http.get<DfResource>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { params, headers });
  }

  getSeriesTables(keyword: string, filters, globalSearch?: boolean): Observable<DfResource> {
    let params = new HttpParams();
    let dfParams = '';
    if (keyword) {
      dfParams += '(tbl contains ' + keyword + ')';
    }
    dfParams = this.constructDfParams(keyword, filters, dfParams);
    if (dfParams) {
      params = params.append('filter', dfParams);
    }
    params = params.append('fields', 'tbl');
    params = params.append('group', 'tbl');
    params = params.append('include_count', 'true');
    params = params.append('order', 'tbl');
    if (globalSearch) {
      params = params.append('limit', '3');
      params = params.append('offset', '0');
    }
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    return this.http.get<DfResource>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { params, headers });
  }

  getSeriesNaics(keyword: string, filters, globalSearch?: boolean): Observable<DfResource> {
    let params = new HttpParams();
    let dfParams = '';
    if (keyword) {
      dfParams += '(naics contains ' + keyword + ')';
    }

    dfParams = this.constructDfParams(keyword, filters, dfParams);
    if (dfParams) {
      params = params.append('filter', dfParams);
    }

    params = params.append('fields', 'naics');
    params = params.append('group', 'naics');
    params = params.append('include_count', 'true');
    params = params.append('order', 'naics');
    if (globalSearch) {
      params = params.append('limit', '3');
      params = params.append('offset', '0');
    }
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    return this.http.get<DfResource>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { params, headers });
  }

  getSeriesItemTypes(): Observable<string[]> {
    let params = new HttpParams();
    params = params.append('fields', 'item_type');
    params = params.append('group', 'item_type');
    params = params.append('order', 'item_type');
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };

    return this.http.get<{ resource: [{ item_type: string }] }>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { params, headers })
      .pipe(map(dfResource => dfResource.resource.map(s => s.item_type)));
  }

  getSeriesViews(): Observable<string[]> {
    let params = new HttpParams();
    params = params.append('fields', 'view');
    params = params.append('group', 'view');
    params = params.append('order', 'view');
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };

    return this.http.get<{ resource: [{ view: string }] }>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { params, headers })
      .pipe(map(dfResource => dfResource.resource.map(s => s.view)));
  }

  private constructDfParams(keyword: string, filters, dfParams): string {

    if (filters.itemTypes && filters.itemTypes.length > 0) {
      if (dfParams) {
        dfParams = dfParams + ' and ' + '(item_type in (' + filters.itemTypes.map(itemType => '"' + itemType + '"').join(',') + '))';
      } else {
        dfParams = 'item_type in (' + filters.itemTypes.map(itemType => '"' + itemType.trim() + '"').join(',') + ')';
      }
    }

    if (filters.tables && filters.tables.length > 0) {
      if (dfParams) {
        dfParams = dfParams + ' and ' + '(tbl in (' + filters.tables.map(table => '"' + table + '"').join(',') + '))';
      } else {
        dfParams = 'tbl in (' + filters.tables.map(table => '"' + table + '"').join(',') + ')';
      }
    }

    if (filters.view && filters.view !== 'BOTH') {
      if (dfParams) {
        dfParams = dfParams + ' and ' + '(view=' + filters.view + ')';
      } else {
        dfParams = '(view=' + filters.view + ')';
      }
    }

    if (filters.seriesNames && filters.seriesNames.length > 0) {
      if (dfParams) {
        dfParams = dfParams + ' and ' + '(name in (' + filters.seriesNames.map(name => '"' + name + '"').join(',') + '))';
      } else {
        dfParams = 'name in (' + filters.seriesNames.map(name => '"' + name + '"').join(',') + ')';
      }
    }

    return dfParams;
  }

  upsert(seriesList: Series[]) {
    const params = new HttpParams();
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    return this.http.put<{ resource: any[] }>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { resource: seriesList }, { params, headers }).pipe(
      tap(res => {
        this.seriesStore.upsertMany(seriesList);
      })
    );
  }

  add(series: Series) {
    let params = new HttpParams();
    params = params.append('fields', '*');
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    delete series.id;
    return this.http.post<{ resource: Series[] }>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { resource: [series] }, { params, headers });
  }

  updateTblField(ids: ID[], field: string) {
    const patchSeries = [];
    const d = new Date();
    ids.forEach(id => {
      patchSeries.push({
        id, tbl: field,
        last_updated: d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2)
      });
    });
    const params = new HttpParams();
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    return this.http.patch<{ resource: any[] }>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { resource: patchSeries }, { params, headers }).pipe(
      tap(res => {
        // this.seriesStore.upsert(ids, { tbl: field });
        this.seriesStore.upsertMany(patchSeries);
      })
    );
  }
  updateTopicField(ids: ID[], field: string) {
    const patchSeries = [];
    const d = new Date();
    ids.forEach(id => {
      patchSeries.push({
        id, topic: field,
        last_updated: d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2)
      });
    });
    const params = new HttpParams();
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    return this.http.patch<{ resource: any[] }>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { resource: patchSeries }, { params, headers }).pipe(
      tap(res => {
        // this.seriesStore.upsert(ids, { tbl: field });
        this.seriesStore.upsertMany(patchSeries);
      })
    );
  }

  deleteSeries(series: Series) {
    // this.seriesStore.remove(series.id);
    let params = new HttpParams();
    params = params.append('ids', series.id.toString());
    // params = params.append('api_key', DFAPI_KEY);
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };

    return this.http.delete<{ resource: Series[] }>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}`, { params, headers });
  }

  updateFilters(filters) {
    this.seriesStore.update({ filters });
  }

  invalidateCache() {
    this.seriesStore.setHasCache(false);
  }

  updateSearchTerm(searchTerm: string) {
    this.seriesStore.update({ searchTerm });
    // this.invalidateCache();
  }

  updateUploadedNames(uploadedNames: string) {
    this.seriesStore.update({ uploadedNames });
    // this.invalidateCache();
  }

  updatePageNumber(pageNumber: number) {
    this.seriesStore.update({ pageNumber });
    // this.invalidateCache();
  }

  updatePageSize(pageSize: number) {
    this.updatePageNumber(1);
    this.seriesStore.update({ pageSize });
    // this.invalidateCache();
  }

  updateCount(count: number) {
    this.seriesStore.update({ count });
    // this.invalidateCache();
  }

  updateFrom(from: string) {
    this.seriesStore.update({ from });
    // this.invalidateCache();
  }

  updateTo(to: string) {
    this.seriesStore.update({ to });
    // this.invalidateCache();
  }

  updateValHeaders(valHeaders: string[]) {
    this.seriesStore.update({ valHeaders });
  }

}
