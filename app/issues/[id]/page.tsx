import { IssueDetail } from '@/components/IssueDetail';
type PageProps={params:Promise<{id:string}>};
export default async function IssuePage({params}:PageProps){const{id}=await params;return <IssueDetail id={id}/>;}