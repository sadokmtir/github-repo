import { Allow, IsIn, IsISO8601, IsString } from 'class-validator';

class QueryParamsDto {
    @Allow()
    @IsIn([10, 50, 100])
    public top: number;

    @IsISO8601(null, {
        message: 'Please provide the start date in ISO8601 format, e.g: 2019-12-10T22:10:12Z (UTC format) or \
                  2019-12-10 (Berlin time which is at that date UTC+01:00 in summer line now it would be UTC+02:00)'
    })
    public since: string;

    @IsString()
    public language: string;
}

export default QueryParamsDto;