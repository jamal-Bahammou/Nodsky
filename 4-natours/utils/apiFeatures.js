class APIFeatures {

   constructor( query, queryReq ) {
      this.query = query;
      this.queryReq = queryReq;
   }

   // 1️⃣ ADVANCED FILTERING
   filter() {
      const queryObj = { ...this.queryReq };
      const exFields = [ 'page', 'sort', 'limit', 'fields' ];
      exFields.forEach( field => delete queryObj[field] );
      this.query = this.query.find(queryObj);

      return this;
   }

   // 2️⃣ SORTING
   sort() {
      if (this.queryReq.sort) {
         this.query = this.query.sort(this.queryReq.sort);
      } else {
         this.query = this.query.sort('-createdAt');
      }

      return this;
   }

   // 3️⃣ FIELD LIMITING
   limitFields() {
      if (this.queryReq.fields) {
         this.query = this.query.select(this.queryReq.fields);
     } else {
         this.query = this.query.select('-__v');
     }

     return this;
   }

   // 4️⃣ PAGINATION
   paginate() {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);

      return this;
   }

}

module.exports = APIFeatures;