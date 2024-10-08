import React from 'react'
import axios from 'axios'
import DataTable from "react-data-table-component"
import Swal from 'sweetalert2';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { deleteApplicantAction } from '../actions/jobApplicantAction';
import Profilescreen from './user/Profilescreen';


let applicantArray;
let AppCount;
let administrativeCount;
let inventoryCount;
let generalCount;
let percentageGen;
let percentageAdmin, percentageInven;

function JobApplicantsManagementScreen() {

    const [applicants, setApplicants] = useState([]);
    const [filterdApplicants, setFilterdApplicants] = useState([]);
    const [searchApplicant, setSearchApplicant] = useState("");
    const [emails, setEmails] = useState([]);




    useEffect(() => {
        function getJobs() {
            axios.get("http://localhost:8070/api/jobapply/getallApplications")
                .then((res) => {
                    setApplicants(res.data);

                    // Filter applicants by job category and count the number of applicants in each category
                    administrativeCount = res.data.filter(applicant => applicant.jobCategory === 'Administrative').length;
                    inventoryCount = res.data.filter(applicant => applicant.jobCategory === 'Inventory').length;
                    generalCount = res.data.filter(applicant => applicant.jobCategory === 'General').length;

                    console.log(`Administrative applicants: ${administrativeCount}`);
                    console.log(`Inventory applicants: ${inventoryCount}`);
                    console.log(`General applicants: ${generalCount}`);

                    const emails = res.data.filter(applicant => applicant.email).map(applicant => applicant.email);
                    setEmails(emails);

                    // calculations
                    applicantArray = res.data;
                    AppCount = applicantArray.length;
                    percentageGen = (generalCount / AppCount) * 100;
                    percentageAdmin = (administrativeCount / AppCount) * 100;
                    percentageInven = (administrativeCount / AppCount) * 100;

                    setFilterdApplicants(res.data);
                })
                .catch((err) => {
                    console.log(err.message)
                });
        }

        getJobs();
    }, []);




    const columns = [
        // {
        //     name: "Applicant ID",
        //     selector: (row) => row._id,
        //     sortable: true
        // },

        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,

        },
        {
            name: "Address",
            selector: (row) => row.address,

        },
        {
            name: "Phone No",
            selector: (row) => row.phoneNo,

        },
        {
            name: "Job Category",
            selector: (row) => row.jobCategory,

        },
        {
            name: "Delete",
            cell: row => <button onClick={() => { deleteApplicant(row._id) }} className="btn" role="button">Delete</button>


        },
        // {
        //     name: "Send Email",
        //     cell: (row) => (
        //       <button onClick={() => sendEmail(row.email)} className="btn" role="button">
        //         Send Email
        //       </button>
        //     )
        //   },

        {
            name: "Send Email",
            cell: row => (
                <button onClick={() => {
                    Swal.fire({
                        title: "Reply",
                        html: `<b>Applicant's Email:</b><br/><br/> ${row.email}`,
                        input: "textarea",
                        inputPlaceholder: "Type your email here",
                        confirmButtonText: "Send",
                        showCancelButton: true,
                        cancelButtonText: "Cancel",
                        preConfirm: (reply) => {
                            const emailAddress = row.email;
                            const subject = "Calling Interviews for Job Vacancies";
                            const emailBody = reply;
                            const emailLink = `https://mail.google.com/mail/?view=cm&to=${emailAddress}&su=${subject}&body=${emailBody}`;
                            window.open(emailLink, "_blank");
                        }
                    })
                }} className="btn" role="button">
                    Reply
                </button>
            )
        }

        ,

    ]

    // function sendEmail(email) {
    //     window.open(`mailto:${email}`);
    //   }



    // search button
    useEffect(() => {
        const results = applicants.filter(applicants => {
            return applicants._id.toLowerCase().includes(searchApplicant.toLowerCase());
        });

        setFilterdApplicants(results);
    }, [searchApplicant]);

    //delete
    const dispatch = useDispatch();

    function deleteApplicant(ApplicantId) {

        dispatch(deleteApplicantAction(ApplicantId));


    }



    return (



        <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className='row justify-content-center'>
                <div className='col-md-9 m-3   p-0 ' >
                    <DataTable

                        title='Job Applicants Management'
                        columns={columns}
                        data={filterdApplicants}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="450px"
                        selectableRows
                        selectableRowsHighlight
                        subHeader
                        subHeaderComponent={
                            <input

                                type="text"
                                placeholder="Search here..."
                                className='w-25 form-control'
                                value={searchApplicant}
                                onChange={(e) => setSearchApplicant(e.target.value)}

                            />

                        }


                    />
                    <br />
                    <br />




                    <div className='modal-footer'>
                        {/* <div className='p-1'>
                            <button class="btn" data-bs-target="#addnewjob" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-plus" aria-hidden="true"></i>Create a New Job</button>
                        </div> */}

                        {/* generate report button */}
                        <div className='p-1'><button class="btn" data-bs-target="#exampleModalToggleReport" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-file" aria-hidden="true"></i> Generate  Report</button>
                        </div>
                        <br />
                        <div className='p-1'>
                            <a href="/admin/jobportalManage" className="btn">
                                <i style={{ fontSize: '15px', color: 'white' }} aria-hidden="true"></i>Go to Job Lists
                            </a>
                        </div>

                    </div>
                </div>
            </div>



            {/* generate report */}

            <div class="modal fade" id="exampleModalToggleReport" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <img src="https://static.wixstatic.com/media/618c8c_e709bfc77cc844ec89f41c021d154a04~mv2.png" alt="" width="80" height="50" class="d-inline-block align-text-top" />
                            <h9 className="text-center m-4" style={{ fontSize: '15px' }}>Hungry Meals Restaurants<br /></h9>
                            <h9 className="text-center m-4" style={{ fontSize: '15px' }}>No.100,Galle Road,Matara<br /></h9>
                            <h9 className="text-center m-4" style={{ fontSize: '15px' }}>Hotline :0777225900<br /></h9>

                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalToggleLabel"> Detailed Report about Job Applicants</h5>
                            {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                        </div>
                        <div class="modal-body">

                            <div class="container my-4">

                                <div class="border p-5 mb-5">

                                    <section>
                                        <div class="row">
                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow shadow" >
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>Total Job Applicants <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }} ></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{AppCount}</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />

                                                        <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p>
                                                        {/* <h5 class="text-muted mb-0">11 467</h5> */}
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>Administrative section <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{administrativeCount}</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />
                                                        <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p>

                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>General Section <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{generalCount}</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />
                                                        <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p>

                                                        <h5 class="text-muted mb-0"></h5>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>Inventory section <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{inventoryCount}</strong>

                                                            <small class="text-danger ms-2">
                                                                <i class="fas fa-arrow-down fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />

                                                        <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p>
                                                        <h5 class="text-muted mb-0"></h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div class="row">
                                            <div class="col-md-8 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">

                                                        <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                                                            <li class="nav-item" role="presentation">
                                                                <a class="nav-link active" id="ex1-tab-1" data-mdb-toggle="pill" role="tab"
                                                                    aria-controls="ex1-pills-1" aria-selected="true">Applicant's Emails</a>
                                                                <ul>
                                                                    {emails.map((email, index) => (
                                                                        <li key={index}>{email}</li>
                                                                    ))}
                                                                </ul>                                                            </li>



                                                        </ul>


                                                        <div class="tab-content" id="ex1-content">
                                                            <div class="tab-pane fade show active" id="ex1-pills-1" role="tabpanel" aria-labelledby="ex1-tab-1">
                                                                <div id="chart-users"></div>
                                                            </div>
                                                            <div class="tab-pane fade" id="ex1-pills-2" role="tabpanel" aria-labelledby="ex1-tab-2">
                                                                <div id="chart-page-views"></div>
                                                            </div>
                                                            <div class="tab-pane fade" id="ex1-pills-3" role="tabpanel" aria-labelledby="ex1-tab-3">
                                                                <div id="chart-average-time"></div>
                                                            </div>
                                                            <div class="tab-pane fade" id="ex1-pills-4" role="tabpanel" aria-labelledby="ex1-tab-4">
                                                                <div id="chart-bounce-rate"></div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-4 mb-4">
                                                <div class="card mb-4">
                                                    <div class="card-body shadow">
                                                        <p class="text-center"><strong></strong></p>
                                                        <div id="pie-chart-current">Percentage of Administrative</div>
                                                        <div id="pie-chart-previous">{percentageAdmin}%</div>
                                                    </div>
                                                </div>

                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-center"><strong>Percentage of General</strong></p>
                                                        <div id="pie-chart-previous">{percentageGen}%</div>
                                                    </div>
                                                </div>

                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-center"><strong>Percentage of Inventory </strong></p>
                                                        <div id="pie-chart-previous">{percentageInven}%</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                </div>


                            </div>

                        </div>

                        <div class="modal-footer">
                            <button class="btn" onClick={() => window.print()} >Print</button>
                            <button class="btn" data-bs-toggle="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default JobApplicantsManagementScreen