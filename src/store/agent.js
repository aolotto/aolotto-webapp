import { createResource, createRoot } from "solid-js";
import { AO } from "../api/ao";
import { createStore } from "solid-js/store";
import { query,createAsync } from "@solidjs/router";

const pid = import.meta.env.VITE_AGENT_PROCESS || "default_pid";
