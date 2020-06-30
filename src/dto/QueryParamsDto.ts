import { Allow, IsIn, IsISO8601, Matches } from 'class-validator';

export const TOP_ERROR_MESSAGE = 'top param should be one of the following values: 10, 50, 100';

export const ISO_DATE_ERROR_MESSAGE = 'Please provide the start date in ISO8601 format,' +
    ' e.g: 2019-12-10T22:10:12Z (UTC format) or ' +
    '2019-12-10 (Berlin time which is at that date UTC+01:00 in summer line now it would be UTC+02:00)';

export const LANGUAGE_ERROR_MESSAGE = 'language must contain only letters (a-zA-Z)';

class QueryParamsDto {
    @Allow()
    @IsIn([10, 50, 100], { message: TOP_ERROR_MESSAGE })
    public top: number;

    @IsISO8601({ strict: false }, {
        message: ISO_DATE_ERROR_MESSAGE
    })
    public since: string;

    @Matches(/^[a-zA-Z]{1,10}$/, { message: LANGUAGE_ERROR_MESSAGE })
    public language: string;
}

export default QueryParamsDto;