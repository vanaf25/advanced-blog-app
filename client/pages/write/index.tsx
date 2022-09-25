import React from 'react';
import { NextPage } from 'next';
import WriteForm from "../../components/WriteForm";
import {withAuth} from "../../utils/withAuth";

const WritePage: NextPage = () => {
  return (
      <WriteForm />
  );
};
export const getServerSideProps=withAuth(()=>{

})
export default WritePage;
