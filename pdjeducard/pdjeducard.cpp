#include "pdjeducard.hpp"

namespace eosio{

   void pdjeducard::create(name admin, string studentname, string subject,
              uint8_t score, string sex, string comment) 
   {
       require_auth( admin );
       eosio_assert(is_account(studentname),"系统中没有这个学生");
       educards ec(_code, _code.value);
       
   
       ec.emplace(admin, [&]( auto& row ) {
       row.cardid=ec.available_primary_key();//主键自动增长	
       row.admin = admin;
       row.studentname = studentname;
       row.subject = subject;
       row.score = score;
       row.sex = sex;
       row.comment = comment;
      });
    }



    void pdjeducard::change (uint64_t cardid,string studentname, string subject,
              uint8_t score, string sex, string comment) 
     { 
       
       educards ec(_code, _code.value);
       auto iterator=ec.find(cardid);
       require_auth( iterator->admin );
       eosio_assert(iterator!=ec.end(),"card not exist!");

       ec.modify(iterator, iterator->admin, [&]( auto& row ) {
       
       row.studentname = studentname;
       row.subject = subject;
       row.score = score;
       row.sex = sex;
       row.comment = comment;
      });
    }
  


  void  pdjeducard::erase(name admin,uint64_t cardid){

    require_auth(admin);
    educards ec(_code, _code.value);
    auto iterator = ec.find( cardid );
    eosio_assert(iterator != ec.end(), "Record does not exist");
    ec.erase(iterator);
  }



}//namespace eosio

EOSIO_DISPATCH( eosio::pdjeducard, (create)(change)(erase))
