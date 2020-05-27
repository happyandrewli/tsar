import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight'
})
export class HighlightSearch implements PipeTransform {
    transform(value: string, keyword: string): any {
        if (!value || !keyword) {
            return value;
        }
        const re = new RegExp(keyword, 'gi');
        return value.replace(re, '<strong>$&</strong>');
    }
}
