const Joi = require('joi');

const DEFAULT_LIMIT = 10;
const DEFAULT_SKIP = 10;
const DEFAULT_DRAW = 1;
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_COLUMNS = '*';

function Paginator() {
  this._limit = DEFAULT_LIMIT;
  this._skip = DEFAULT_SKIP;
  this._sortColumn = [];
  this._sortOrder = [];
  this._logicQuery = null;
  this._selectQuery = null;
  this._totalQuery = null;
  this._draw = DEFAULT_DRAW;
  this._page = DEFAULT_PAGE_NUMBER;
  this._columns = DEFAULT_COLUMNS;
  this._finalQuery = null;
  this._selectQueryPrefix = null;
  this._totalQueryPrefix = null;
  this._totalQuerySuffix = null;

  this._values = [];

  this._totalRecords = null;
  this._filteredRecords = null;
}

Paginator.prototype.limit = function(limit) {
  this._limit = limit;
  return this;
};

Paginator.prototype.skip = function(skip) {
  this._skip = skip;
  return this;
};

Paginator.prototype.page = function(page) {
  this._page = page;
  return this;
};

Paginator.prototype.columns = function(columns) {
  this._columns = columns;
  return this;
};

Paginator.prototype.totalQueryPrefix = function(totalQueryPrefix) {
  this._totalQueryPrefix = totalQueryPrefix;
  return this;
};

Paginator.prototype.totalQuerySuffix = function(totalQuerySuffix) {
  this._totalQuerySuffix = totalQuerySuffix;
  return this;
};

Paginator.prototype.logicQuery = function(logicQuery) {
  this._logicQuery = logicQuery;
  return this;
};

Paginator.prototype._validate = function() {
  //   Joi.assert(this._selectQuery, Joi.string().optional());
  //   Joi.assert(this._totalQuery, Joi.string().required());
};

Paginator.prototype._getSortColumn = function(column) {
  return typeof this._columns[column] === 'object' ? this._columns[column].name : this._columns[column];
};

Paginator.prototype._formQuery = function() {
    if (this._logicQuery !== null) {
      this._selectQuery = `${this._selectQueryPrefix || 'SELECT'} ${this.getSelectColumns(this._columns)} ${this._logicQuery}
      ${this._sortColumn ? ` ORDER BY ${this._getSortColumn(this._sortColumn)} ${this._sortOrder}` : ''}
      LIMIT $1 OFFSET $2`;
    this._totalQuery = `${this._totalQueryPrefix || 'SELECT COUNT(*)'} ${this._logicQuery} ${this._totalQuerySuffix || ''}`;
  }
  this._values.push(this._limit);
  this._values.push(this._skip);
};


Paginator.prototype.getSelectColumns = function (obj) {
  if (!obj || typeof obj === 'string') return this._columns;
  let columns = Object.keys(obj).map((key) => {
    if (typeof this._columns[key] === 'object') {
      return this._columns[key].format ? this._columns[key].format : this._columns[key].name;
    }
    return this._columns[key];
  });
  columns = columns || [];
  return columns.join(',');
};

Paginator.prototype.enrichPaginationParams = function (params) {
  if (!params) return {};
  const paginator = {};
  if (params && params.sort && params.sort.length > 0) {
    paginator.sortColumn = params.sort[0];
    paginator.sortOrder = params.sort[1] || 'ASC';
  }

  paginator.limit = params.perPageRecords || 10;
  paginator.skip = paginator.limit * ((+params.page || 1) - 1);
  paginator.draw = Number(params.draw || 0) + 1;
  this._limit = paginator.limit;
  this._draw = paginator.draw;
  this._skip = paginator.skip;
  this._sortColumn = paginator.sortColumn;
  this._sortOrder = paginator.sortOrder;
  return paginator;
};

Paginator.prototype.formatPaginationResponse = function (filteredData, totalRecords, draw) {
  return {
    recordsTotal: totalRecords[0].count || 0,
    recordsFiltered: filteredData.length || 0,
    records: filteredData || [],
    draw: draw || 1,
  };
};

Paginator.prototype.query = async function (pg) {
  let self = this;
  /**
   * Validate Paginator Params
   */
  this._validate();
  /**
   * Form Query
   */
  this._formQuery();

  this._totalRecords = await pg.query(this._totalQuery, []);
  this._filteredRecords = await pg.query(this._selectQuery, this._values);
  this._totalRecords = this._totalRecords.rows;
  this._filteredRecords = this._filteredRecords.rows;

  return this.formatPaginationResponse(this._filteredRecords, this._totalRecords);
};

module.exports = function (obj) {
  obj.Paginator = Paginator;
};