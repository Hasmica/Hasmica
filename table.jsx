import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import {
  Table,
  Space,
  Button,
  Typography,
  Skeleton,
  Pagination,
  Radio,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import FilterComponent from "./FilterComponent";
import { ReactComponent as EmptyState } from "./Images/noData.svg";

const { Title } = Typography;
const itemsPerPage = 7;
const searchDelay = 500;

// currentPageId.includes('Expenses') &&

export function MyTable() {
  const kf = window.kf;
  const application_id = kf.app._id;
  const account_id = kf.account._id;
  const currentPageId = kf.app.page._id;

  // const [activityInstanceIdField, setActivityInstanceIdField] = useState('');
  // const [amountField, setAmountField] = useState('');
  // const [reqIdField, setReqIdField] = useState('');
  // const [requesterIdField, setRequesterIdField] = useState('');

  const newFormPopupId = currentPageId.includes("Expenses")
    ? "Popup_DMVnCeIvO"
    : "Popup_OCsfQDRd2";
  const policyDocPopupId = currentPageId.includes("Expenses")
    ? "Popup_8sEupi-zk"
    : "Popup_f7hZfsCdm";
  const activityInstanceIdField = currentPageId.includes("Expenses")
    ? "Column_S_B5dN2ldt"
    : "Column_AEpakUwEhC";
  const amountField = currentPageId.includes("Expenses")
    ? "Column_wSIZvTMspN"
    : "Column_Lku9BSN_Bv";
  const requesterIdField = currentPageId.includes("Expenses")
    ? "Column_zMOScp5NBN"
    : "Column_lnuqrHM64t";
  // const reqIdField = currentPageId.includes("Expenses") ? "Column_e_VHXK7g5_" : "Column_NGf1Tiy0sp";

  const [emptyicon, setemptyicon] = useState("none");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("pendingTasks");
  const [ids, setIds] = useState(null);
  // const [buttonText, setButtonText] = useState(' +  Add expense ');

  const [url, setUrl] = useState("");
  const [urlFilter, setUrlFilter] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [isPendingActive, setIsPendingActive] = useState(true);
  const [isWithdrawActive, setIsWithdrawActive] = useState(false);
  const [isRejectedActive, setIsRejectedActive] = useState(false);
  const [isApprovedActive, setIsApprovedActive] = useState(false);

  const [pendingType, setPendingType] = useState("primary");
  const [approvedType, setApprovedType] = useState("default");
  const [rejectedType, setRejectedType] = useState("default");
  const [withdrawType, setwithdrawType] = useState("default");

  // const [processId, setProcessId] = useState('');
  // const [pendingTasksReportId, setPendingTasksReportId] = useState('');
  // const [actedTasksReportId, setActedTasksReportId] = useState('');
  // const [myItemsReportId, setMyItemsReportId] = useState('');

  const [pendingTotal, setPendingTotal] = useState(0);
  const [approvedTotal, setApprovedTotal] = useState(0);
  const [rejectedTotal, setRejectedTotal] = useState(0);
  const [withdrawnTotal, setWithdrawnTotal] = useState(0);

  const [fieldsToDisplay, setFieldsToDisplay] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [paginationTotal, setPaginationTotal] = useState(0);
  // const [activityInstanceIdField, setActivityInstanceIdField] = useState('');
  // const [amountField, setAmountField] = useState('');
  // const [reqIdField, setReqIdField] = useState('');
  // const [requesterIdField, setRequesterIdField] = useState('');

  // const [pendingColumns, setPendingColumns] = useState([]);
  // const [approvedColumns, setApprovedColumns] = useState([]);
  // const [rejectedColumns, setRejectedColumns] = useState([]);
  // const [withdrawColumns, setWithdrawColumns] = useState([]);

  // const [pendingData, setPendingData] = useState([]);
  // const [approvedData, setApprovedData] = useState([]);
  // const [rejectedData, setRejectedData] = useState([]);
  // const [withdrawData, setWithdrawData] = useState([]);

  useEffect(() => {
    console.log("currentPageId = ", currentPageId);
    setMode("myTasks");
  }, [currentPageId]);

  useEffect(() => {
    if (mode !== "") {
      if (mode === "myTasks") {
        setCurrentTab("pendingTasks");
        fetchCounts("pendingTasks");
      } else {
        setCurrentTab("pendingItems");
        fetchCounts("pendingItems");
      }

      // fetchCounts();
      setCurrentPage(1);

      setIsPendingActive(true);
      setIsApprovedActive(false);
      setIsRejectedActive(false);

      setPendingType("primary");
      setApprovedType("default");
      setRejectedType("default");
    }
  }, [mode]);

  // useEffect(() => {
  //   console.log("In WatchParams useEffect");
  //   const kf = window.kf;
  //   kf.context.watchParams(function (data) {
  //     console.log("WatchParams triggered: data --> ",data);
  //     console.log("useEffect url = ", url);
  //     if(url !== ''){
  //       try {
  //         fetchData(1, '');
  //         fetchCounts("pendingTasks");
  //       } catch (error) {
  //         console.error('Error fetching initial data:', error);
  //       } finally {
  //         setLoading(false);
  //         setemptyicon('block');
  //       }
  //     }
  //     else{
  //       fetchUrl(ids, currentTab);
  //     }
  //   });
  // })

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [currentTab])

  const fetchCounts = async (tab) => {
    const ids = await checkIds();

    const _tab = tab ? tab : currentTab;

    fetchUrl(ids, _tab);

    const process_id = ids.process_id;
    const pendingTasks_report_id = ids.pendingTasks_report_id;
    // const actedTasks_report_id = ids.actedTasks_report_id;
    const approvedTasks_report_id = ids.approvedTasks_report_id;
    const rejectedTasks_report_id = ids.rejectedTasks_report_id;
    const myItems_report_id = ids.myItems_report_id;

    console.log("---in fetchCounts---");
    console.log("mode = ", mode);
    console.log("process_id = ", process_id);
    console.log("pendingTasks_report_id = ", pendingTasks_report_id);
    // console.log("actedTasks_report_id = ",actedTasks_report_id);
    console.log("approvedTasks_report_id = ", approvedTasks_report_id);
    console.log("rejectedTasks_report_id = ", rejectedTasks_report_id);
    console.log("myItems_report_id = ", myItems_report_id);

    if (mode === "myTasks") {
      kf.api(
        `/process-report/2/${account_id}/${process_id}/${pendingTasks_report_id}/count`
      ).then((pendingCountResponse) => {
        setPendingTotal(pendingCountResponse.Count);
      });

      kf.api(
        `/process-report/2/${account_id}/${process_id}/${rejectedTasks_report_id}/count`
      ).then((rejectedCountResponse) => {
        setRejectedTotal(rejectedCountResponse.Count);
      });

      kf.api(
        `/process-report/2/${account_id}/${process_id}/${approvedTasks_report_id}/count`
      ).then((approvedCountResponse) => {
        setApprovedTotal(approvedCountResponse.Count);
      });

      // const approvedCountResponse = await kf.api(`/process-report/2/${account_id}/${process_id}/${actedTasks_report_id}/count?$status=InProgress&$current_step=Finance Manager Approval`);
      // const completedCountResponse = await kf.api(`/process-report/2/${account_id}/${process_id}/${actedTasks_report_id}/count?$status=Completed`);
      // setApprovedTotal(approvedCountResponse.Count + completedCountResponse.Count);
    } else {
      kf.api(
        `/process-report/2/${account_id}/${process_id}/${myItems_report_id}/count?$status=InProgress`
      ).then((pendingCountResponse) => {
        setPendingTotal(pendingCountResponse.Count);
      });

      kf.api(
        `/process-report/2/${account_id}/${process_id}/${myItems_report_id}/count?$status=Withdrawn`
      ).then((withdrawnCountResponse) => {
        setWithdrawnTotal(withdrawnCountResponse.Count);
      });

      kf.api(
        `/process-report/2/${account_id}/${process_id}/${myItems_report_id}/count?$status=Completed`
      ).then((approvedCountResponse) => {
        setApprovedTotal(approvedCountResponse.Count);
      });

      kf.api(
        `/process-report/2/${account_id}/${process_id}/${myItems_report_id}/count?$status=Rejected`
      ).then((rejectedCountResponse) => {
        setRejectedTotal(rejectedCountResponse.Count);
      });
    }
  };

  const checkIds = async () => {
    const kf = window.kf;

    // const ids = {
    //   process_id: '',
    //   pendingTasks_report_id: '',
    //   // actedTasks_report_id: '',
    //   approvedTasks_report_id: '',
    //   rejectedTasks_report_id: '',
    //   myItems_report_id: ''
    // };

    if (currentPageId.includes("Expenses")) {
      console.log("---in checkIds Expenses---");

      // setButtonText(" +  Add expense ");

      const ids = {
        process_id: await kf.app.getVariable(
          "expenseFinanceApproval_process_id"
        ),
        pendingTasks_report_id: await kf.app.getVariable(
          "expenseFinanceApproval_report_id"
        ),
        // actedTasks_report_id: await kf.app.getVariable("expenseActedTasks_report_id"),
        approvedTasks_report_id: await kf.app.getVariable(
          "expenseFinanceApprovedTasks_report_id"
        ),
        rejectedTasks_report_id: await kf.app.getVariable(
          "expenseFinanceRejectedTasks_report_id"
        ),
        myItems_report_id: await kf.app.getVariable("expenseMyItems_report_id"),
      };

      const names = {
        process_name: "Expense Management",
        pendingTasks_report_name: "Finance Manager Expense Approval Report",
        // actedTasks_report_name : "Acted Tasks",
        approvedTasks_report_name: "My Tasks - Finance Approved",
        rejectedTasks_report_name: "My tasks - Finance Rejected",
        myItems_report_name: "My Items report",
      };

      const fetchIds = await getFetchIds(ids, names);
      console.log("in checkIds - Expenses,  fetchIds = ", fetchIds);
      return fetchIds;
    } else if (currentPageId.includes("Advances")) {
      console.log("---in checkIds Advances---");

      // setButtonText(" +  Add advance ")

      const ids = {
        process_id: await kf.app.getVariable(
          "advanceFinanceApproval_process_id"
        ),
        pendingTasks_report_id: await kf.app.getVariable(
          "advanceFinanceApproval_report_id"
        ),
        // actedTasks_report_id: await kf.app.getVariable("advanceActedTasks_report_id"),
        approvedTasks_report_id: await kf.app.getVariable(
          "advanceFinanceApprovedTasks_report_id"
        ),
        rejectedTasks_report_id: await kf.app.getVariable(
          "advanceFinanceRejectedTasks_report_id"
        ),
        myItems_report_id: await kf.app.getVariable("advanceMyItems_report_id"),
      };

      const names = {
        process_name: "Advance Payment Request Process",
        pendingTasks_report_name: "Advance Finance Approval Tabular Report",
        // actedTasks_report_name : "Acted Tasks",
        approvedTasks_report_name: "My Tasks - Finance Approved",
        rejectedTasks_report_name: "My tasks - Finance Rejected",
        myItems_report_name: "My Items report",
      };

      const fetchIds = await getFetchIds(ids, names);
      console.log("in checkIds - Advances,  fetchIds = ", fetchIds);
      return fetchIds;
    }
  };

  const getFetchIds = async (ids, names) => {
    console.log("in getFetchIds Begining ---- ids = ", ids);

    const allIdsFetched = Object.values(ids).every(
      (id) => id !== undefined && id !== ""
    );
    console.log("allIdsFetched = ", allIdsFetched);
    if (allIdsFetched) {
      console.log("In allIdsFetched");
      console.log("ids =", ids);

      setIds(ids);
      setCurrentPage(1);
      // setProcessId(ids["process_id"]);
      // setPendingTasksReportId(ids["pendingTasks_report_id"]);
      // setActedTasksReportId(ids["actedTasks_report_id"]);
      // setMyItemsReportId(ids["myItems_report_id"]);

      console.log("Gonna call fetchUrl & fetchCounts");

      // fetchUrl(ids, 1, "pendingTasks");
      return ids;
    }

    console.log("Ids not found. Fetching them...");

    const application_id = kf.app._id;
    const account_id = kf.account._id;
    const process_list = await kf.api(
      `/flow/2/${account_id}/process?_application_id=${application_id}`
    );

    console.log("process_list = ", process_list);

    if (!ids.process_id || ids.process_id === "") {
      const process_name = names["process_name"];
      const process_info = process_list.find(
        (itm) => itm.Name === process_name
      );
      ids["process_id"] = process_info?._id;
      console.log("Fetched process_id:", ids.process_id);

      if (currentPageId.includes("Expenses")) {
        kf.app.setVariable("expenseFinanceApproval_process_id", ids.process_id);
      } else if (currentPageId.includes("Advances")) {
        kf.app.setVariable("advanceFinanceApproval_process_id", ids.process_id);
      }
    }

    if (
      !ids.pendingTasks_report_id ||
      ids.pendingTasks_report_id === "" ||
      !ids.approvedTasks_report_id ||
      ids.approvedTasks_report_id === "" ||
      !ids.rejectedTasks_report_id ||
      ids.rejectedTasks_report_id === "" ||
      !ids.myItems_report_id ||
      ids.myItems_report_id === ""
    ) {
      try {
        const pendingTasks_report_response = await kf.api(
          `/flow/2/${account_id}/process/${ids.process_id}/report?_application_id=${application_id}`
        );
        console.log("Fetched report_response:", pendingTasks_report_response);

        if (!ids.pendingTasks_report_id || ids.pendingTasks_report_id === "") {
          const pendingTasks_report_name = names["pendingTasks_report_name"];
          const pendingTasks_report_info = pendingTasks_report_response.find(
            (item) => item.Name === pendingTasks_report_name
          );

          if (pendingTasks_report_info) {
            ids["pendingTasks_report_id"] = pendingTasks_report_info._id;
            console.log(
              "Fetched pendingTasks_report_id:",
              ids.pendingTasks_report_id
            );

            if (currentPageId.includes("Expenses")) {
              kf.app.setVariable(
                "expenseFinanceApproval_report_id",
                ids.pendingTasks_report_id
              );
            } else if (currentPageId.includes("Advances")) {
              kf.app.setVariable(
                "advanceFinanceApproval_report_id",
                ids.pendingTasks_report_id
              );
            }
          } else {
            console.log("Pending tasks report not found.");
          }
        }

        // if (!ids.approvedTasks_report_id || ids.approvedTasks_report_id === '') {
        if (
          !ids.approvedTasks_report_id ||
          ids.approvedTasks_report_id === ""
        ) {
          const approvedTasks_report_name = names["approvedTasks_report_name"];
          const approvedTasks_report_info = pendingTasks_report_response.find(
            (item) => item.Name === approvedTasks_report_name
          );

          if (approvedTasks_report_info) {
            ids["approvedTasks_report_id"] = approvedTasks_report_info._id;
            console.log(
              "Fetched approvedTasks_report_id:",
              ids.approvedTasks_report_id
            );

            if (currentPageId.includes("Expenses")) {
              kf.app.setVariable(
                "expenseFinanceApprovedTasks_report_id",
                ids.approvedTasks_report_id
              );
            } else if (currentPageId.includes("Advances")) {
              kf.app.setVariable(
                "advanceFinanceApprovedTasks_report_id",
                ids.approvedTasks_report_id
              );
            }
          } else {
            console.log("Approved Tasks report not found.");
          }
        }
        // }

        // if (!ids.rejectedTasks_report_id || ids.rejectedTasks_report_id === '') {
        if (
          !ids.rejectedTasks_report_id ||
          ids.rejectedTasks_report_id === ""
        ) {
          const rejectedTasks_report_name = names["rejectedTasks_report_name"];
          const rejectedTasks_report_info = pendingTasks_report_response.find(
            (item) => item.Name === rejectedTasks_report_name
          );

          if (rejectedTasks_report_info) {
            ids["rejectedTasks_report_id"] = rejectedTasks_report_info._id;
            console.log(
              "Fetched rejectedTasks_report_id:",
              ids.rejectedTasks_report_id
            );

            if (currentPageId.includes("Expenses")) {
              kf.app.setVariable(
                "expenseFinanceRejectedTasks_report_id",
                ids.rejectedTasks_report_id
              );
            } else if (currentPageId.includes("Advances")) {
              kf.app.setVariable(
                "advanceFinanceRejectedTasks_report_id",
                ids.rejectedTasks_report_id
              );
            }
          } else {
            console.log("Rejected Tasks report not found.");
          }
        }
        // }

        // if (!ids.myItems_report_id || ids.myItems_report_id === '') {
        if (!ids.myItems_report_id || ids.myItems_report_id === "") {
          const myItems_report_name = names["myItems_report_name"];
          const myItems_report_info = pendingTasks_report_response.find(
            (item) => item.Name === myItems_report_name
          );

          if (myItems_report_info) {
            ids["myItems_report_id"] = myItems_report_info._id;
            console.log("Fetched myItems_report_id:", ids.myItems_report_id);

            if (currentPageId.includes("Expenses")) {
              kf.app.setVariable(
                "expenseMyItems_report_id",
                ids.myItems_report_id
              );
            } else if (currentPageId.includes("Advances")) {
              kf.app.setVariable(
                "advanceMyItems_report_id",
                ids.myItems_report_id
              );
            }
          } else {
            console.log("My Items report not found.");
          }
        }
        // }
      } catch (error) {
        console.error("Error fetching report ids:", error);
      }
    }

    console.log("in getFetchIds End ---- ids = ", ids);

    const allIdsFetchedFinal = Object.values(ids).every(
      (id) => id !== undefined && id !== ""
    );
    if (allIdsFetchedFinal) {
      console.log("In allIdsFetchedFinal");

      setIds(ids);
      setCurrentPage(1);
      // setProcessId(ids["process_id"]);
      // setPendingTasksReportId(ids["pendingTasks_report_id"]);
      // setActedTasksReportId(ids["actedTasks_report_id"]);
      // setMyItemsReportId(ids["myItems_report_id"]);

      console.log("Gonna call fetchUrl & fetchCounts");

      // fetchUrl(ids, 1, "pendingTasks");
      return ids;
    } else {
      throw new Error("One or more IDs not found in API responses.");
    }
  };

  const fetchUrl = async (ids, tab) => {
    console.log("in fetchUrl, mode = ", mode, " tab = ", tab);

    const process_id = ids.process_id;
    const pending_report_id = ids.pendingTasks_report_id;
    // const acted_report_id = ids.actedTasks_report_id;
    const approved_report_id = ids.approvedTasks_report_id;
    const rejected_report_id = ids.rejectedTasks_report_id;
    const myItems_report_id = ids.myItems_report_id;

    console.log("in fetchUrl, ids = ", ids);

    if (currentPageId.includes("Expenses")) {
      if (tab === "pendingTasks") {
        setFieldsToDisplay([
          "Expense_ID",
          "Common_date",
          "Common_category",
          "Actual_expense_amount",
          "Total_Reimbursable_Amount_single",
          "created_by_user_id",
          "Activity_Instance_ID",
        ]);
      } else {
        setFieldsToDisplay([
          "Expense_ID",
          "Common_date",
          "Common_category",
          "Actual_expense_amount",
          "Total_Reimbursable_Amount_single",
          // 'Attach_Receipts',
          // 'created_by_user_id',
          "_current_step",
          "Activity_Instance_ID",
        ]);
      }

      // setFieldsToDisplay(fields);
    } else if (currentPageId.includes("Advances")) {
      if (tab === "pendingTasks") {
        setFieldsToDisplay([
          "Advance_Request_ID",
          "Date_1",
          "Advance_Payment_Category",
          "Payment_Type",
          "Advance_Amount",
          "created_by_user_id",
          "Activity_Instance_ID",
        ]);
      } else {
        setFieldsToDisplay([
          "Advance_Request_ID",
          "Date_1",
          "Advance_Payment_Category",
          "Payment_Type",
          "Advance_Amount",
          "_current_step",
          "Activity_Instance_ID",
        ]);
      }
    }

    if (mode === "myTasks" && tab === "pendingTasks") {
      console.log("in My tasks Pending items");

      setCurrentTab("pendingTasks");

      setIsPendingActive(true);
      setIsApprovedActive(false);
      setIsRejectedActive(false);

      setPendingType("primary");
      setApprovedType("default");
      setRejectedType("default");

      console.log("process_id = ", process_id);
      console.log("pending_report_id = ", pending_report_id);

      const apiUrl = `/process-report/2/${account_id}/${process_id}/${pending_report_id}?`;

      console.log("Setting url : ", apiUrl);

      setUrl(apiUrl);
      // setUrlFilter('');
    } else if (mode === "myTasks" && tab === "approvedTasks") {
      console.log("in My tasks Approved items");

      setCurrentTab("approvedTasks");

      setIsPendingActive(false);
      setIsApprovedActive(true);
      setIsRejectedActive(false);

      setPendingType("default");
      setApprovedType("primary");
      setRejectedType("default");

      console.log("process_id = ", process_id);
      console.log("approved_report_id = ", approved_report_id);

      const apiUrl = `/process-report/2/${account_id}/${process_id}/${approved_report_id}?`;

      console.log("Setting url : ", apiUrl);

      setUrl(apiUrl);
      // setUrlFilter('');
    } else if (mode === "myTasks" && tab === "rejectedTasks") {
      console.log("in My tasks Rejected items");

      setCurrentTab("rejectedTasks");

      setIsPendingActive(false);
      setIsApprovedActive(false);
      setIsRejectedActive(true);

      setPendingType("default");
      setApprovedType("default");
      setRejectedType("primary");

      console.log("process_id = ", process_id);
      console.log("rejected_report_id = ", rejected_report_id);

      const apiUrl = `/process-report/2/${account_id}/${process_id}/${rejected_report_id}?`;

      console.log("Setting url : ", apiUrl);

      setUrl(apiUrl);
      // setUrlFilter('');
    } else if (mode === "myItems" && tab === "pendingItems") {
      console.log("in My items Pending items");

      setCurrentTab("pendingItems");

      setIsPendingActive(true);
      setIsWithdrawActive(false);
      setIsRejectedActive(false);
      setIsApprovedActive(false);

      setPendingType("primary");
      setwithdrawType("default");
      setApprovedType("default");
      setRejectedType("default");

      console.log("process_id = ", process_id);
      console.log("pending_report_id = ", pending_report_id);

      const apiUrl = `/process-report/2/${account_id}/${process_id}/${myItems_report_id}?$status=InProgress&`;
      // const filter = `$status=InProgress&`;

      console.log("Setting url = ", apiUrl);

      setUrl(apiUrl);
      // setUrlFilter(filter);
    } else if (mode === "myItems" && tab === "withdrawnItems") {
      console.log("in My items Withdrawn items");

      setCurrentTab("withdrawnItems");

      setIsPendingActive(false);
      setIsWithdrawActive(true);
      setIsRejectedActive(false);
      setIsApprovedActive(false);

      setPendingType("default");
      setwithdrawType("primary");
      setApprovedType("default");
      setRejectedType("default");

      console.log("process_id = ", process_id);
      console.log("myItems_report_id = ", myItems_report_id);

      const apiUrl = `/process-report/2/${account_id}/${process_id}/${myItems_report_id}?$status=Withdrawn&`;
      // const filter = `$status=Withdrawn&`;

      console.log("Setting url = ", apiUrl);

      setUrl(apiUrl);
      // setUrlFilter(filter);
      // setUrlFilter('');
    } else if (mode === "myItems" && tab === "approvedItems") {
      console.log("in My items Approved items");

      setCurrentTab("approvedItems");

      setIsPendingActive(false);
      setIsWithdrawActive(false);
      setIsRejectedActive(true);
      setIsApprovedActive(false);

      setPendingType("default");
      setwithdrawType("default");
      setApprovedType("primary");
      setRejectedType("default");

      console.log("process_id = ", process_id);
      console.log("myItems_report_id = ", myItems_report_id);

      const apiUrl = `/process-report/2/${account_id}/${process_id}/${myItems_report_id}?$status=Completed&`;
      // const filter = `$status=Completed&`;

      console.log("Setting url = ", apiUrl);

      setUrl(apiUrl);
      // setUrlFilter(filter);
    } else if (mode === "myItems" && tab === "rejectedItems") {
      console.log("in My items Rejected items");

      setCurrentTab("rejectedItems");

      setIsPendingActive(false);
      setIsWithdrawActive(false);
      setIsRejectedActive(false);
      setIsApprovedActive(true);

      setPendingType("default");
      setwithdrawType("default");
      setApprovedType("default");
      setRejectedType("primary");

      console.log("process_id = ", process_id);
      console.log("myItems_report_id = ", myItems_report_id);

      const apiUrl = `/process-report/2/${account_id}/${process_id}/${myItems_report_id}?$status=Rejected&`;
      // const filter = `$status=Rejected&`;

      console.log("Setting url = ", apiUrl);

      setUrl(apiUrl);
      // setUrlFilter(filter);
    }

    setCurrentPage(1);
  };

  useEffect(() => {
    console.log("useEffect url = ", url);
    if (url !== "") {
      try {
        console.log(
          "Calling fetchdata... with currentPage = ",
          currentPage,
          " searchQuery = ",
          searchQuery
        );
        fetchData(currentPage, searchQuery);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
        // setemptyicon('block');
      }
    }
  }, [url, searchQuery]);

  // useEffect(() => {
  // setCurrentPage(1);
  // }, [])

  // const fetchData = async (url, pageNumber, query) => {
  const fetchData = async (pageNumber, query) => {
    try {
      if (query) {
        console.log("Search query from filter : " + query);
        setSearchQuery(query);
      } else {
        console.log("No Search query from filter");
      }

      // url + count + filter + query + page + app

      // url + count ? + filter & + query & + page + app

      console.log("in fetchData begining--- url = ", url);

      // console.log("filter = ",urlFilter);

      // const urlpageNumber = `page_number=${pageNumber}&page_size=${itemsPerPage}`;
      // console.log("urlpageNumber = ",urlpageNumber);

      const queryString = searchQuery ? `q=${searchQuery}&` : "";
      console.log("queryString = ", queryString);

      // const completeUrl = `${url}${urlFilter}?page_number=${pageNumber}&page_size=${itemsPerPage}${queryString}`;
      // console.log("completeUrl = ",completeUrl);

      console.log("pageNumber = ", pageNumber, " currentPage = ", currentPage);

      if (pageNumber === 1 || searchQuery !== "") {
        const _url = url.split("?")[0];
        const urlFilter = url.split("?")[1];
        console.log("_url = ", _url, " urlFilter = ", urlFilter);
        console.log(
          "complete count url = ",
          `${_url}/count?${urlFilter}${queryString}page_number=${pageNumber}&page_size=${itemsPerPage}`
        );
        kf.api(
          `${_url}/count?${urlFilter}${queryString}page_number=${pageNumber}&page_size=${itemsPerPage}`
        ).then((paginationCountResponse) => {
          setPaginationTotal(paginationCountResponse.Count);
        });
      }

      console.log(
        "complete data url = ",
        `${url}${queryString}page_number=${pageNumber}&page_size=${itemsPerPage}`
      );
      kf.api(
        `${url}${queryString}page_number=${pageNumber}&page_size=${itemsPerPage}`
      ).then((apiResp) => {
        console.log("apiResp = ", apiResp);

        if (apiResp) {
          console.log("apiResp.Data = ", apiResp.Data);

          const apiRespData = apiResp.Data;
          console.log("apiReapData = ", apiRespData);

          if (apiRespData.length > 0) {
            const filteredMain = apiResp.Columns.filter((itemMain) => {
              return fieldsToDisplay.some(
                (itemFlow) => itemMain.FieldId === itemFlow
              );
            });

            const generateColumns = (columns) => {
              return columns.map((each) => {
                // if (each.Name === "Activity Instance ID") {
                //   setActivityInstanceIdField(each.Id)
                // }
                if (
                  each.FieldId === "Expense_ID" ||
                  each.FieldId === "Advance_Request_ID"
                ) {
                  return {
                    title: each.Name,
                    dataIndex: each.Id,
                    key: each.Name,
                    render: (text, record) => (
                      <a
                        onClick={() => {
                          console.log("record = ", record);
                          console.log(
                            "instance_id = ",
                            record._id,
                            " activity_instance_id = ",
                            record[activityInstanceIdField]
                          );
                          kf.app.page.openPopup(newFormPopupId, {
                            instance_id: record._id,
                            activity_instance_id:
                              record[activityInstanceIdField],
                          });
                        }}
                      >
                        {text}
                      </a>
                    ),
                  };
                } else if (each.FieldId === "Common_date") {
                  return {
                    title: "Date",
                    dataIndex: each.Id,
                    key: each.Name,
                    ...(each.FieldId === "Activity_Instance_ID" && {
                      hidden: true,
                    }),
                  };
                } else if (each.FieldId === "Common_category") {
                  return {
                    title: "Category",
                    dataIndex: each.Id,
                    key: each.Name,
                    ...(each.FieldId === "Activity_Instance_ID" && {
                      hidden: true,
                    }),
                  };
                } else if (each.FieldId === "Actual_expense_amount") {
                  return {
                    title: "Expense amount",
                    dataIndex: each.Id,
                    key: each.Name,
                    ...(each.FieldId === "Activity_Instance_ID" && {
                      hidden: true,
                    }),
                  };
                } else if (each.FieldId === "created_by_user_id") {
                  return {
                    title: "Requester",
                    dataIndex: each.Id,
                    key: each.Name,
                    ...(each.FieldId === "Activity_Instance_ID" && {
                      hidden: true,
                    }),
                  };
                } else {
                  return {
                    title: each.Name,
                    dataIndex: each.Id,
                    key: each.Name,
                    ...(each.FieldId === "Activity_Instance_ID" && {
                      hidden: true,
                    }),
                  };
                }
              });
            };

            const _columns = generateColumns(filteredMain);
            const columns = _columns.filter((item) => !item.hidden);

            if (currentTab === "pendingTasks") {
              console.log("Showing Approve-Reject buttons..");
              const col = [
                ...columns,
                {
                  title: "Actions",
                  key: "action",
                  render: (text, record) => (
                    <Space size="middle">
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        style={{
                          backgroundColor: "#F2F9F2",
                          borderColor: "#C0E3BF",
                          color: "#4AA147",
                          boxShadow: "none",
                        }}
                        onClick={() => handleApprove(record, ids.process_id)}
                      />
                      <Button
                        type="primary"
                        icon={<CloseOutlined />}
                        style={{
                          backgroundColor: "#FDF3F2",
                          borderColor: "#EC8F8C",
                          color: "#DF4440",
                          boxShadow: "none",
                        }}
                        onClick={() => handleReject(record, ids.process_id)}
                      />
                    </Space>
                  ),
                },
              ];

              setTableColumns(col);
            } else {
              console.log("Not showing Approve-Reject buttons..");
              setTableColumns(columns);
            }

            setTableData(apiRespData);

            const handleApprove = async (record, process_id) => {
              const id = record._id;
              const activityInstanceId = record[activityInstanceIdField];
              // const amount = record[amountField];
              // const reqId = record[reqIdField];
              // const requester = record[requesterIdField]

              // const showConfirmTitle = "Confirm Approval of " + record[reqIdField] + " from " + record[requesterIdField];
              // const showConfirmContent = 'Are you sure you want to Approve $?'+record[amountField];

              const showConfirmContent =
                record[requesterIdField] +
                " has claimed for an amount of " +
                record[amountField] +
                ". Are you sure you want to approve?";

              kf.client
                .showConfirm({
                  title: "Confirm Approval",
                  content: showConfirmContent,
                })
                .then((res) => {
                  if (res === "OK") {
                    kf.api(
                      `/process/2/${account_id}/${process_id}/${id}/${activityInstanceId}/submit?_application_id=${application_id}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    ).then((submitResp) => {
                      if (submitResp) {
                        console.log("submitResp = ", submitResp);
                        let randNum = Math.random();
                        console.log("setted rand in table ---", randNum);
                        kf.app.setVariable("managerRandNum", randNum);
                        setCurrentPage(1);
                        fetchData(1, "");
                        fetchCounts("pendingTasks");
                      }
                    });
                  } else {
                  }
                })
                .catch((err) => {
                  console.log(err, "Error in callback: handleApprove");
                });
            };

            const handleReject = async (record, process_id) => {
              const id = record._id;
              const activityInstanceId = record[activityInstanceIdField];

              const showRejectContent =
                record[requesterIdField] +
                " has claimed for an amount of " +
                record[amountField] +
                ". Are you sure you want to reject?";

              kf.client
                .showConfirm({
                  title: "Confirm Reject",
                  content: showRejectContent,
                })
                .then((res) => {
                  if (res === "OK") {
                    kf.api(
                      `/process/2/${account_id}/${process_id}/${id}/${activityInstanceId}/reject`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    ).then((rejectResp) => {
                      if (rejectResp) {
                        console.log("rejectResp = ", rejectResp);
                        setCurrentPage(1);
                        fetchData(1, "");
                        fetchCounts("pendingTasks");
                      }
                    });
                  } else {
                  }
                })
                .catch((err) => {
                  console.log(err, "Error in callback: handleReject");
                });
            };
          } else {
            setTableData([]);
            setLoading(false);
            setemptyicon("block");
          }
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      // setemptyicon('block');
    }
  };

  const handlePageChange = (newPage) => {
    console.log("Pagination change to page:", newPage);

    setCurrentPage(newPage);
    // setLoading(true);
    fetchData(newPage, searchQuery);
    // fetchUrl(ids, currentTab);
    // fetchData = async (url, pageNumber, query)
  };

  const handleSearch = (query) => {
    console.log("Search from filter:", query);
    setSearchQuery(query);
    setCurrentPage(1);
    setLoading(true);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        // fetchData(1, query);
        fetchUrl(ids, currentTab);
      }, searchDelay)
    );
  };

  const handleModeChange = (e) => {
    console.log("mode value = ", e.target.value);
    setMode(e.target.value);
  };

  const openNewForm = () => {
    console.log("Opening new form");

    const kf = window.kf;
    kf.app.page.openPopup(newFormPopupId);
  };

  const openPolicyDoc = () => {
    console.log("Opening policy doc");

    const kf = window.kf;
    kf.app.page.openPopup(policyDocPopupId);
  };

  const noDataText = currentPageId.includes("Expenses")
    ? "No expense request yet"
    : "No advance request yet";
  const noDataSubText = currentPageId.includes("Expenses")
    ? "It seems like no expense requests have been added yet"
    : "It seems like no advance requests have been added yet";
  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: "flex",
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      <Title className="clsTitle" level={4}>
        {currentPageId.includes("Expenses") ? "Expenses" : "Advances"}
      </Title>

      <div className="clsHomeRow" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="clsHomeRowLeft">
          <Radio.Group
            onChange={handleModeChange}
            value={mode}
            style={{ marginBottom: 8 }}
          >
            <Radio.Button value="myTasks">My task</Radio.Button>
            <Radio.Button value="myItems">My item</Radio.Button>
          </Radio.Group>
        </div>
        <div className="clsHomeRowRight">
          <Button type="link" onClick={openPolicyDoc}>
            View policy
          </Button>
          <Button type="primary" onClick={openNewForm}>
            {" "}
            + New request{" "}
          </Button>
        </div>
      </div>

      <div className="clsTabHomeRow">
        <div className="clsHomeRowLeft">
          {mode === "myTasks" ? (
            <>
              <Space wrap>
                <Button
                  style={{ left: "10px" }}
                  type={pendingType}
                  shape="round"
                  size={"small"}
                  onClick={() => {
                    fetchUrl(ids, "pendingTasks");
                  }}
                >
                  Pending ({pendingTotal})
                </Button>
                <Button
                  style={{ left: "10px" }}
                  type={approvedType}
                  shape="round"
                  size={"small"}
                  onClick={() => fetchUrl(ids, "approvedTasks")}
                >
                  Approved ({approvedTotal})
                </Button>
                <Button
                  style={{ left: "10px" }}
                  type={rejectedType}
                  shape="round"
                  size={"small"}
                  onClick={() => fetchUrl(ids, "rejectedTasks")}
                >
                  Rejected ({rejectedTotal})
                </Button>
              </Space>
            </>
          ) : (
            <>
              <Space wrap>
                <Button
                  style={{ left: "10px" }}
                  type={pendingType}
                  shape="round"
                  size={"small"}
                  onClick={() => fetchUrl(ids, "pendingItems")}
                >
                  Pending ({pendingTotal})
                </Button>
                <Button
                  style={{ left: "10px" }}
                  type={withdrawType}
                  shape="round"
                  size={"small"}
                  onClick={() => fetchUrl(ids, "withdrawnItems")}
                >
                  Withdraw ({withdrawnTotal})
                </Button>
                <Button
                  style={{ left: "10px" }}
                  type={approvedType}
                  shape="round"
                  size={"small"}
                  onClick={() => fetchUrl(ids, "approvedItems")}
                >
                  Approved ({approvedTotal})
                </Button>
                <Button
                  style={{ left: "10px" }}
                  type={rejectedType}
                  shape="round"
                  size={"small"}
                  onClick={() => fetchUrl(ids, "rejectedItems")}
                >
                  Rejected ({rejectedTotal})
                </Button>
              </Space>
            </>
          )}
        </div>
        <div className="clsHomeRowRightSearch">
          <FilterComponent
            filterText={searchQuery}
            onFilter={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <Table
            className="clsTable"
            columns={tableColumns}
            dataSource={tableData}
            pagination={false}
            locale={{
              emptyText: (
                <div style={{ textAlign: "center", display: emptyicon }}>
                  <EmptyState height="320" width="250" />
                  <p style={{ fontSize: "20px" }}>{noDataText}</p>
                  <p style={{ fontSize: "15px" }}>{noDataSubText}</p>
                </div>
              ),
            }}
            {...(tableData.length === 0 && {
              components: {
                header: {
                  wrapper: (props) => (
                    <thead style={{ display: "none" }} {...props} />
                  ),
                },
              },
            })}
          />
          <div style={{ display: "flex", justifyContent: "end" }}>
            {paginationTotal > itemsPerPage && (
              <Pagination
                style={{ marginTop: "10px", marginLeft: "15px" }}
                current={currentPage}
                defaultPageSize={itemsPerPage}
                total={paginationTotal}
                onChange={handlePageChange}
              />
            )}
          </div>
        </>
      )}
    </Space>
  );
}

export default MyTable;
