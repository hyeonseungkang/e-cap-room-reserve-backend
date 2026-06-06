import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

/**
 * Oracle은 따옴표 없이 생성된 식별자(테이블/컬럼)를 대문자로 저장한다.
 * (예: CREATE TABLE meeting_rooms -> MEETING_ROOMS)
 * TypeORM은 식별자를 큰따옴표로 감싸 조회하므로, 매핑명을 대문자로 변환하지 않으면
 * "meeting_rooms" != MEETING_ROOMS 가 되어 ORA-00942 / ORA-00904 가 발생한다.
 * 이 전략은 생성되는 모든 식별자를 대문자로 통일한다.
 */
export class UppercaseNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    return super.tableName(targetName, userSpecifiedName).toUpperCase();
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return super
      .columnName(propertyName, customName, embeddedPrefixes)
      .toUpperCase();
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return super
      .joinColumnName(relationName, referencedColumnName)
      .toUpperCase();
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return super
      .joinTableColumnName(tableName, propertyName, columnName)
      .toUpperCase();
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    return super.primaryKeyName(tableOrName, columnNames).toUpperCase();
  }
}
