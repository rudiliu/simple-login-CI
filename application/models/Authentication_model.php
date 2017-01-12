<?php

    /******************************************
    *      Codeigniter 3 Simple Login         *
    *   Developer  :  rudiliucs1@gmail.com    *
    *        Copyright © 2017 Rudi Liu        *
    *******************************************/

if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class Authentication_model extends CI_Model {

    function __construct() {
        parent::__construct();
    }


    function validate_login($postData){
        $this->db->select('*');
        $this->db->where('email', $postData['email']);
        $this->db->where('password', md5($postData['password']));
        $this->db->where('status', 1);
        $this->db->from('user');
        $query=$this->db->get();
        if ($query->num_rows() == 0)
            return false;
        else
            return $query->result();
    }

    function change_password($postData){
        $this->load->model('admin_model');
        $validate = false;

        $oldData = $this->admin_model->get_user_by_id($this->session->userdata('user_id'));

        if($oldData[0]['password'] == md5($postData['currentPassword']))
            $validate = true;

        if($validate){
            $data = array(
                'password' => md5($postData['newPassword']),
            );
            $this->db->where('user_id', $this->session->userdata('user_id'));
            $this->db->update('user', $data);

            $module = "Change Password";
            $activity = "change its own password";
            $this->admin_model->insert_log($activity, $module);
            return array('status' => 'success', 'message' => '');
        }else{
            return array('status' => 'invalid', 'message' => '');
        }

    }
}

/* End of file  */
