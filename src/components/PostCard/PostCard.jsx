import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { BiComment, BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import { NoProfile } from "../../assets";
import { CustomButton, Loading, TextInput } from "../elementComponents";
import { postComments } from "../../assets/data";
import { baseUrlForUploads, ToastMessage } from "../../App";
import { CiVolumeHigh, CiVolumeMute } from "react-icons/ci";
import { fetchPosts, fetchRequestCaller } from "../../utils";
const ReplyCard = ({ reply, user, handleLike }) => {
  return (
    <div className="w-full py-3">
      <div className="flex gap-3 items-center mb-1">
        <Link to={"/profile/" + reply?.userId?._id}>
          <img
            src={
              reply?.userId?.profileUrl
                ? `${baseUrlForUploads}/${reply?.userId?.profileUrl}`
                : NoProfile
            }
            alt={reply?.userId?.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link to={"/profile/" + reply?.userId?._id}>
            <p className="font-medium text-base text-ascent-1">
              {reply?.userId?.firstName} {reply?.userId?.lastName}
            </p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(reply?.createdAt).fromNow()}
          </span>
        </div>
      </div>

      <div className="ml-12">
        <p className="text-ascent-2 ">{reply?.comment}</p>
        <div className="mt-2 flex gap-6">
          <p
            className="flex gap-2  items-center text-base text-ascent-2 cursor-pointer"
            onClick={handleLike}
          >
            {reply?.likes?.includes(user?._id) ? (
              <BiSolidLike size={20} color="blue" />
            ) : (
              <BiLike size={20} />
            )}
            {reply?.likes?.length} Likes
          </p>
        </div>
      </div>
    </div>
  );
};

const CommentForm = ({ user, id, replyAt, getComments }) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    let apiUrl = replyAt
      ? "/posts/reply-comment/" + id
      : "/posts/comment/" + id;
    let res = await fetchRequestCaller({
      url: apiUrl,
      method: "POST",
      token: user?.token,
      data: {
        from: user?.firstName + " " + user?.lastName,
        comment: data?.comment ?? " ",
        replyAt: replyAt ?? " ",
      },
    });
    setValue("comment", " ");
    getComments();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border-b border-[#66666645]"
    >
      <div className="w-fit h-fit flex items-center gap-2 py-4">
        <img
          src={
            user?.profileUrl
              ? `${baseUrlForUploads}/${user?.profileUrl}`
              : NoProfile
          }
          alt="User Image"
          className="w-10 h-10 rounded-full object-cover"
        />

        <TextInput
          name="comment"
          styles="w-full rounded-full py-3"
          placeholder={replyAt ? `Reply @${replyAt}` : "Comment this post"}
          register={register("comment", {
            required: "Comment can not be empty",
          })}
          error={errors.comment ? errors.comment.message : ""}
        />
      </div>
      {errMsg?.message && (
        <span
          role="alert"
          className={`text-sm ${
            errMsg?.status === "failed"
              ? "text-[#f64949fe]"
              : "text-[#2ba150fe]"
          } mt-0.5`}
        >
          {errMsg?.message}
        </span>
      )}

      <div className="flex items-end justify-end pb-2">
        {loading ? (
          <Loading />
        ) : (
          <CustomButton
            title="Submit"
            type="submit"
            containerStyles="bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm"
          />
        )}
      </div>
    </form>
  );
};

const PostCard = ({ post, user, fetchPosts }) => {
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);

  const fetchComments = async () => {
    let res = await fetchRequestCaller({
      url: "/posts/comments/" + post?._id,
      token: user?.token,
      method: "GET",
    });
    setComments(res.data);
  };
  const deletePost = async (id) => {
    let res = await fetchRequestCaller({
      url: "/posts/delete-post/" + id,
      method: "DELETE",
      token: user?.token,
    });
    fetchPosts();
  };
  const getComments = async () => {
    setReplyComments(0);
    fetchComments();
    setLoading(false);
  };
  const handleCommentLike = async (id, rid) => {
    let apiUrl = rid
      ? `/posts/like-comment/${id}/${rid}`
      : "/posts/like-comment/" + id;
    let res = await fetchRequestCaller({
      url: apiUrl,
      method: "POST",
      token: user?.token,
    });
    getComments();
  };
  const handlePostLike = async (id) => {
    let res = await fetchRequestCaller({
      url: "/posts/like/" + id,
      method: "POST",
      token: user?.token,
    });
    fetchPosts();
  };
  const [volumeHigh, setVolumeHigh] = useState(false);
  return (
    <div className="mb-2 bg-primary p-4  rounded-xl">
      <div className="flex gap-3 items-center mb-3 ">
        <Link to={"/profile/" + post?.userId?._id}>
          <img
            src={
              post?.userId?.profileUrl
                ? `${baseUrlForUploads}/${post?.userId?.profileUrl}`
                : NoProfile
            }
            alt={post?.userId?.firstName}
            className="w-14 h-12 object-cover rounded-full"
          />
        </Link>

        <div className="w-full flex justify-between ">
          <div className="">
            <Link to={"/profile/" + post?.userId?._id}>
              <p
                title={`${post?.userId?.firstName} ${post?.userId?.lastName}`}
                className="font-medium text-lg text-ascent-1 max-sm:text-[15px] line-clamp-1 "
              >
                {post?.userId?.firstName} {post?.userId?.lastName}
              </p>
            </Link>
            <span className="text-ascent-2">{post?.userId?.location}</span>
          </div>

          <span className="text-ascent-2 max-sm:text-xs">
            {moment(post?.createdAt ?? "2023-05-25").fromNow()}
          </span>
        </div>
      </div>

      <div>
        <p className="text-ascent-2 pl-2">
          {showAll === post?._id
            ? post?.description
            : post?.description.slice(0, 300)}

          {post?.description?.length > 301 &&
            (showAll === post?._id ? (
              <span
                className="text-blue ml-2 font-mediu cursor-pointer"
                onClick={() => setShowAll(0)}
              >
                Show Less
              </span>
            ) : (
              <span
                className="text-blue ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(post?._id)}
              >
                Show More
              </span>
            ))}
        </p>

        {post?.type === "image" && post?.media && (
          <img
            src={`${baseUrlForUploads}/${post?.media}`}
            alt="post image"
            className="w-full mt-2 rounded-lg"
          />
        )}
        {post?.type === "video" && post?.media && (
          <div className="relative">
            <video
              muted={!volumeHigh}
              autoPlay
              loop
              src={`${baseUrlForUploads}/${post?.media}`}
              alt="post image"
              className="w-full mt-2 rounded-lg"
            />
            {volumeHigh ? (
              <CiVolumeHigh
                size={25}
                onClick={() => setVolumeHigh(!volumeHigh)}
                className="absolute bottom-3 right-3 text-white"
              />
            ) : (
              <CiVolumeMute
                size={25}
                onClick={() => setVolumeHigh(!volumeHigh)}
                className="absolute bottom-3 right-3 text-white"
              />
            )}
          </div>
        )}
      </div>

      <div
        className="mt-4 flex justify-between items-center px-3  py-2 text-ascent-2
      text-base border-t border-[#66666645]"
      >
        <p
          onClick={() => handlePostLike(post?._id)}
          className="flex gap-2 items-center text-base cursor-pointer"
        >
          {post?.likes?.includes(user?._id) ? (
            <BiSolidLike size={20} color="blue" />
          ) : (
            <BiLike size={20} />
          )}
          {post?.likes?.length} <span className="max-sm:hidden">Likes</span>
        </p>

        <p
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => {
            setShowComments(showComments === post._id ? null : post._id);
            getComments(post?._id);
          }}
        >
          <BiComment size={20} />
          {post?.comments?.length}{" "}
          <span className="max-sm:hidden">Comments</span>
        </p>

        {user?._id === post?.userId?._id && (
          <div
            className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
            onClick={() => deletePost(post?._id)}
          >
            <MdOutlineDeleteOutline size={20} />
            <span
              className="
            max-sm:hidden"
            >
              Delete
            </span>
          </div>
        )}
      </div>

      {/* COMMENTS */}
      {showComments === post?._id && (
        <div className="w-full mt-4 border-t border-[#66666645] pt-4 ">
          <CommentForm
            id={post._id}
            user={user}
            getComments={() => getComments(post?._id)}
          />

          {loading ? (
            <Loading />
          ) : comments?.length > 0 ? (
            comments?.map((comment) => (
              <div className="w-full py-2" key={comment?._id}>
                <div className="flex gap-3 items-center mb-1">
                  <Link to={"/profile/" + comment?.userId?._id}>
                    <img
                      src={
                        comment?.userId?.profileUrl
                          ? `${baseUrlForUploads}/${comment?.userId?.profileUrl}`
                          : NoProfile
                      }
                      alt={comment?.userId?.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={"/profile/" + comment?.userId?._id}>
                      <p className="font-medium text-base text-ascent-1">
                        {comment?.userId?.firstName} {comment?.userId?.lastName}
                      </p>
                    </Link>
                    <span className="text-ascent-2 text-sm">
                      {moment(comment?.createdAt ?? "2023-05-25").fromNow()}
                    </span>
                  </div>
                </div>

                <div className="ml-12">
                  <p className="text-ascent-2">{comment?.comment}</p>

                  <div className="mt-2 flex gap-6">
                    <p
                      onClick={() => handleCommentLike(comment._id)}
                      className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer"
                    >
                      {comment?.likes?.includes(user?._id) ? (
                        <BiSolidLike size={20} color="blue" />
                      ) : (
                        <BiLike size={20} />
                      )}
                      {comment?.likes?.length} Likes
                    </p>
                    <span
                      className="text-blue cursor-pointer"
                      onClick={() => setReplyComments(comment?._id)}
                    >
                      Reply
                    </span>
                  </div>

                  {replyComments === comment?._id && (
                    <CommentForm
                      user={user}
                      id={comment?._id}
                      replyAt={comment?.from}
                      getComments={() => getComments(comment?._id)}
                    />
                  )}
                </div>

                {/* REPLIES */}

                <div className="py-2 px-8 mt-6">
                  {comment?.replies?.length > 0 && (
                    <p
                      className="text-base text-ascent-1 cursor-pointer "
                      onClick={() =>
                        setShowReply(
                          showReply === comment?.replies?._id
                            ? 0
                            : comment?.replies?._id
                        )
                      }
                    >
                      Replies ({comment?.replies?.length})
                    </p>
                  )}

                  {showReply === comment?.replies?._id &&
                    comment?.replies?.map((reply) => (
                      <ReplyCard
                        reply={reply}
                        user={user}
                        key={reply?._id}
                        handleLike={() =>
                          handleCommentLike(comment?._id, reply?._id)
                        }
                      />
                    ))}
                </div>
              </div>
            ))
          ) : (
            <span className="flex text-sm py-4 text-ascent-2 text-center">
              No Comments, be first to comment
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
