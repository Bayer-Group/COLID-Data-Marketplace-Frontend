import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})

// Reference -> https://codersloth.com/blogs/a-simple-time-ago-pipe-to-display-relative-time-in-angular/
export class TimeAgoPipe implements PipeTransform {

  // constructor(public datepipe: DatePipe){
  
  // }

  transform(value: any): any {
    if (value) {
      const differenceInSeconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      // less than 30 seconds ago will show as 'Just now'
      if (differenceInSeconds < 30){
        return 'Just now';
      }
      /* 
      If you want to show a relative date up to months only
      like '2 months ago', '11 months ago', etc 
      and don't need relative dates such as 'one year ago' or 'six years ago', then
      you can uncomment this section. Comment the 'year' field from the timeIntervals object and 
      write the upperLimit value as 31536000. 
      NOTE : If you are using following code block then notice that 
      we are using the transform function of DatePipe from 'angular/common' to format given Date value.
      Don't forget to import add it to your providers array of app.module.ts. 
      See other formating from DatePipe here - https://angular.io/api/common/DatePipe#pre-defined-format-options

      */
      // const upperLimit = 31536000;
      // if(differenceInSeconds > upperLimit){
      //   return this.datepipe.transform(new Date(value), 'MMM d, y');
      // } 
      
      
      
      // All values are in seconds
      const timeIntervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1,
      };
      let counter;
      for (const i in timeIntervals) {
          counter = Math.floor(differenceInSeconds / timeIntervals[i]);
          console.log("Counter is "+ counter);
          if (counter > 0){
            if (counter === 1) {
              // singular (1 day ago)
              return counter + ' ' + i + ' ago'; 
            } else {
                // plural (2 days ago)
                return counter + ' ' + i + 's ago'; 
            }
          }
              
      }

    }
    return value;
  }

}
