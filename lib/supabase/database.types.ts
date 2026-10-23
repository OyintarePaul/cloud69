export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      files: {
        Row: {
          created_at: string
          folder_id: string | null
          id: string
          is_trash_root: boolean
          last_heartbeat_at: string
          mime_type: string
          name: string
          owner_id: string
          size_bytes: number
          status: Database["public"]["Enums"]["upload_status"]
          storage_path: string
          trash_batch_id: string | null
          trashed_at: string | null
          updated_at: string
          uploader_tab_id: string | null
        }
        Insert: {
          created_at?: string
          folder_id?: string | null
          id?: string
          is_trash_root?: boolean
          last_heartbeat_at?: string
          mime_type?: string
          name: string
          owner_id: string
          size_bytes: number
          status?: Database["public"]["Enums"]["upload_status"]
          storage_path: string
          trash_batch_id?: string | null
          trashed_at?: string | null
          updated_at?: string
          uploader_tab_id?: string | null
        }
        Update: {
          created_at?: string
          folder_id?: string | null
          id?: string
          is_trash_root?: boolean
          last_heartbeat_at?: string
          mime_type?: string
          name?: string
          owner_id?: string
          size_bytes?: number
          status?: Database["public"]["Enums"]["upload_status"]
          storage_path?: string
          trash_batch_id?: string | null
          trashed_at?: string | null
          updated_at?: string
          uploader_tab_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string
          id: string
          is_trash_root: boolean
          name: string
          owner_id: string
          parent_id: string | null
          trash_batch_id: string | null
          trashed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_trash_root?: boolean
          name: string
          owner_id: string
          parent_id?: string | null
          trash_batch_id?: string | null
          trashed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_trash_root?: boolean
          name?: string
          owner_id?: string
          parent_id?: string | null
          trash_batch_id?: string | null
          trashed_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          quota_bytes: number
          used_bytes: number
        }
        Insert: {
          id: string
          quota_bytes?: number
          used_bytes?: number
        }
        Update: {
          id?: string
          quota_bytes?: number
          used_bytes?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      collect_subtree_files: {
        Args: { p_file_ids: string[]; p_folder_ids: string[] }
        Returns: {
          file_id: string
          storage_path: string
        }[]
      }
      complete_upload: { Args: { p_file_id: string }; Returns: undefined }
      create_file_row: {
        Args: {
          p_folder: string
          p_mime: string
          p_name: string
          p_size: number
          p_tab_id: string
        }
        Returns: {
          file_id: string
          final_name: string
          object_name: string
        }[]
      }
      create_folder: {
        Args: { p_name: string; p_parent: string }
        Returns: {
          created_at: string
          id: string
          is_trash_root: boolean
          name: string
          owner_id: string
          parent_id: string | null
          trash_batch_id: string | null
          trashed_at: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "folders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      delete_item_rows: {
        Args: { p_file_ids: string[]; p_folder_ids: string[] }
        Returns: {
          files_deleted: number
          folders_deleted: number
        }[]
      }
      fail_upload: { Args: { p_file_id: string }; Returns: boolean }
      get_breadcrumbs: {
        Args: { p_folder_id: string }
        Returns: {
          depth: number
          id: string
          name: string
        }[]
      }
      heartbeat: {
        Args: { p_file_ids: string[]; p_tab_id: string }
        Returns: number
      }
      move_items: {
        Args: { p_file_ids: string[]; p_folder_ids: string[]; p_target: string }
        Returns: number
      }
      next_available_name: {
        Args: { p_kind: string; p_name: string; p_parent: string }
        Returns: string
      }
      rename_item: {
        Args: { p_id: string; p_kind: string; p_name: string }
        Returns: string
      }
      restore_batch: {
        Args: { p_batch_id: string }
        Returns: {
          final_name: string
          item_id: string
          item_kind: string
          new_parent_id: string
        }[]
      }
      search_items: {
        Args: { p_q: string }
        Returns: {
          item_id: string
          item_kind: string
          item_name: string
          mime_type: string
          parent_id: string
          parent_path: string
        }[]
      }
      trash_items: {
        Args: { p_file_ids: string[]; p_folder_ids: string[] }
        Returns: string[]
      }
      validate_name: { Args: { p: string }; Returns: string }
    }
    Enums: {
      upload_status: "uploading" | "ready"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      upload_status: ["uploading", "ready"],
    },
  },
} as const
