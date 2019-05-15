#pragma once

#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>

#include <string>
namespace eosiosystem{
        class system_contract;
}
namespace eosio{
	using std::string;


	class [[eosio::contract("pdjeducard")]] pdjeducard : public contract{
		public:
			using contract::contract;
			[[eoiso::action]]
			void create(name admin, string studentname, string subject, uint8_t score, string sex, string comment) ;
			[[eoiso::action]]
			void change(uint64_t cardid, string studentname, string subject, uint8_t score, string sex, string comment) ;
			[[eosio::action]]
			void erase(name admin,uint64_t cardid);
	

		private:
                  struct [[eosio::table]] structEducard {
		    	uint64_t cardid;
		    	name admin;
		    	string studentname;
		   	string subject;
		 	uint8_t score;
		   	string sex;
		    
		   	string comment;
	   	 	uint64_t primary_key() const { return cardid; }

		  	
		};
		typedef eosio::multi_index<"edu"_n, structEducard> educards;
	};
}//namespace eosio
