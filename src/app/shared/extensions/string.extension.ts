import { Constants } from 'src/app/shared/constants';

export class StringExtension {
  public static ExtractGuid(str: string): string {
    const reg_guid = Constants.Regex.Guid;
    return reg_guid.test(str) ? reg_guid.exec(str)[0] : null;
  }

  public static ReplaceSpecialCharacterFromText(str: string): string {
    if (str == null) {
      return '';
    }

    str = str.replace(/[ÀÁÂÃÅ]/g, 'A');
    str = str.replace(/[ÈÉÊË]/g, 'E');
    str = str.replace(/[ÌÍÎ]/g, 'I');
    str = str.replace(/[ÒÓÔÕ]/g, 'O');
    str = str.replace(/[ÙÚÛ]/g, 'U');
    str = str.replace(/[åàáâãå]/g, 'a');
    str = str.replace(/[èéêë]/g, 'e');
    str = str.replace(/[ìíî]/g, 'i');
    str = str.replace(/[òóôõø]/g, 'o');
    str = str.replace(/[ùúû]/g, 'u');
    str = str.replace(/[Ç]/g, 'C');
    str = str.replace(/[Ð]/g, 'D');
    str = str.replace(/[Ñ]/g, 'N');
    str = str.replace(/[Ý]/g, 'Y');
    str = str.replace(/[ç]/g, 'c');
    str = str.replace(/[ñ]/g, 'n');
    str = str.replace(/[ý]/g, 'y');

    return str;
  }

  public static ReplaceHtmlToText(str: string): string {
    str = this.ReplaceSpecialCharacterFromText(str);
    str = str.replace(/\n|<.*?>/g, '');

    return str;
  }
}
